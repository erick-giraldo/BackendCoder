import UsersService from "../services/users.service.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import __dirname from "../config/utils.js";
import isEmpty from "is-empty";
import MailingController from "./MailingController.js";

class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await UsersService.getDTO();
      if (isEmpty(users)) {
        throw new Error("No se encontraron usuarios");
      }
      return res.sendSuccess(users);
    } catch (err) {
      return res.sendServerError({
        message: "Error al obtener los usuarios",
        error: err.message,
      });
    }
  }

  static async updateRoleById(req, res) {
    try {
      const { id } = req.params;
      const user = await UsersService.getById(id);
      const newRole = getNewRole(user.role).toLowerCase();
      if (!newRole) {
        throw new Error("El rol del usuario no puede ser el mismo");
      }
      user.role = newRole;
      await user.save();
      return res.sendSuccess({
        message: "El rol del usuario fue actualizado exitosamente",
      });
    } catch (err) {
      return res.sendServerError({
        message: "Error al actualizar el rol del usuario",
        error: err.message,
      });
    }
  }

  static async deleteInactiveUsers(req, res) {
    try {
      const dosDiasAtras = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      const usuarios = await UsersService.get();
      const usuariosInactivos = usuarios.filter(
        (usuario) => new Date(usuario.last_connection) < dosDiasAtras
      );

      const correosUsuariosInactivos = usuariosInactivos.map(
        (usuario) => usuario.email
      );

      if (isEmpty(usuariosInactivos)) {
        throw new Error("No se encontraron usuarios inactivos");
      }
   
      const deleteInactiveUsers = await UsersService.deleteMany({
        last_connection: { $lte: dosDiasAtras },
      });

      if (deleteInactiveUsers.deletedCount > 0) {
        for (const usuario of usuariosInactivos) {
          const fullName = `${usuario.first_name} ${usuario.last_name}`;
          const sendEmail = await MailingController.sendEmailDeleteUsers(
            usuario.email,
            fullName
          );
          if (!sendEmail) {
            throw new Error("Ocurrió un error al enviar el correo");
          }
        }
      } else {
        throw new Error("No se pudieron eliminar los usuarios inactivos");
      }
  
      return res.sendSuccess({
        message: `Los siguientes usuarios: [ ${correosUsuariosInactivos.join(
          ", "
        )} ] fueron eliminados debido a 2 días de inactividad.`,
      });
    } catch (err) {
      return res.sendServerError({
        message: "Error al eliminar los usuarios inactivos",
        error: err.message,
      });
    }
  }

  static async deleteUserByID(req, res) {
    try {
      const { id } = req.params;
      const user = await UsersService.getById(id);
      if (isEmpty(user)) {
        throw new Error("El usuario no fue encontrado");
      }
      await UsersService.deleteById({ _id: id });
      return res.sendSuccess({
        message: `El usuario  ${user.email} fue eliminado exitosamente`
      });
    } catch (err) {
      return res.sendServerError({
        message: "Error al eliminar el usuario",
        error: err.message,
      });
    }
  }

  static async uploadDocuments(req, res) {
    try {
      const { id } = req.params;
      const { type } = req.query;
      upload.array("files")(req, res, async (err) => {
        if (err) {
          const statusCode = err.statusCode || 500;
          const errorMessage = err.status || "Error interno del servidor";

          return res.status(statusCode).json({
            message: errorMessage,
          });
        }
        const fileType = getFiletype(type);
        console.log("🚀 ~ file: UserController.js:127 ~ UserController ~ upload.array ~ fileType:", fileType)
        const user = await UsersService.getById(id);
        if (isEmpty(user)) {
          return res.sendUserError({
            message: "Usuario no encontrado, por favor intente nuevamente.",
          });
        }

        if (!user.documents) {
          user.documents = [];
        }

        const pendingDocIndex = user.documents.findIndex(
          (doc) => doc.name === "Pendiente subir documentos"
        );
        if (pendingDocIndex !== -1) {
          user.documents.splice(pendingDocIndex, 1);
        }

        if (isEmpty(req.files)) {
          return res.sendUserError({
            message: "No se subieron archivos.",
          });
        }

        const uploadedFiles = req.files.map((file) => {
          const newName = file.originalname.split(".")[0];
          const isDuplicate = user.documents.some(
            (doc) => doc.name === newName
          );
          if (isDuplicate) {
            return {
              name: newName,
              status: "Archivo repetido",
            };
          } else {
            user.documents.push({
              name: newName,
              reference: `/uploads/${fileType}/${file.filename}`,
            });
            return {
              name: newName,
              status: "Archivo subido exitosamente",
            };
          }
        });

        await UsersService.updateUserDoc(
          id,
          user.documents
        );

        return res.status(200).json({
          message: "Documentos subidos exitosamente",
          documentsStatus: uploadedFiles,
        });
      });
    } catch (error) {
      return res.sendServerError({
        message: "Error al subir los documentos",
        error: error.message,
      });
    }
  }
}

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const { id } = req.params;
    const { type } = req.query;

    try {
      const user = await UsersService.getById(id);
      const newName = file.originalname.split(".")[0];
      const isDuplicate = user.documents.some((doc) => doc.name === newName);

      if (isDuplicate) {
        return cb({
          status: "Archivo repetido",
          statusCode: 400,
        });
      }

      let folder;
      if (type === "profile") {
        folder = "profiles";
      } else if (type === "product") {
        folder = "products";
      } else {
        folder = "documents";
      }
      const destinationFolder = path.join(
        __dirname,
        "../public/uploads",
        folder,
        id
      );

      fs.mkdirSync(destinationFolder, { recursive: true });
      cb(null, destinationFolder);
    } catch (err) {
      return cb({
        status: "Error al obtener el usuario",
        statusCode: 500,
      });
    }
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const filename = `${Date.now()}${extension}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

const getFiletype = (type) => {
  switch (type) {
    case "profile":
      return "profile";
    case "product":
      return "product";
    default:
      return "document";
  }
};

const getNewRole = (currentRole) => {
  const roleMap = {
    USER: "PREMIUM",
    PREMIUM: "USER",
  };
  return roleMap[currentRole.toUpperCase()] || null;
};

export default UserController;
