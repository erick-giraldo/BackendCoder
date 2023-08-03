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
      const users = await UsersService.getDTO().catch(() => {
        throw new Error(
          JSON.stringify({ detail: "No se encontraron usuarios" })
        );
      });
      return res.sendSuccess(users);
    } catch (err) {
      return res.status(400).json({
        message: "Error al obtener los usuarios",
        error: err.message,
      });
    }
  }

  static async updateRoleById(req, res) {
    try {
      const { id } = req.params;
      const user = await UsersService.getById(id).catch(() => {
        throw new Error(
          JSON.stringify({ detail: "El usuario no fue encontrado" })
        );
      });
      const newRole = getNewRole(user.role).toLowerCase();
      if (!newRole) {
        throw new Error(
          JSON.stringify({ detail: "El rol del usuario no puede ser el mismo" })
        );
      }

      user.role = newRole;
      await user.save();
      return res.sendSuccess({
        message: "El rol del usuario fue actualizado exitosamente",
      });
    } catch (err) {
      return res.sendUserError({
        message: "Error al actualizar el rol del usuario",
        error: err.message,
      });
    }
  }

  static async deleteInactiveUsers(req, res) {
    try {
      const dosDiasAtras = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      const usuarios = await UsersService.get().catch(() => {
        throw new Error(
          JSON.stringify({ detail: "No se encontraron usuarios" })
        );
      });
      const usuariosInactivos = usuarios.filter(
        (usuario) => new Date(usuario.last_connection) < dosDiasAtras
      );

      const correosUsuariosInactivos = usuariosInactivos.map(
        (usuario) => usuario.email
      );

      if (isEmpty(usuariosInactivos)) {
        throw new Error(
          JSON.stringify({ detail: "No se encontraron usuarios inactivos" })
        );
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
          if (!sendEmail) throw new Error(JSON.stringify({ detail: 'Ocurrio un error al enviar el correo' }))
        }
      }else{
        throw new Error(
          JSON.stringify({
            detail: "No se pudieron eliminar los usuarios inactivos",
          })
        );
      }
  
      return res.sendSuccess({
        message: `Los siguientes usuarios: [ ${correosUsuariosInactivos.join(
          ", "
        )} ] fueron eliminados debido a 2 días de inactividad.`,
      });
    } catch (err) {
      return res.sendUserError({
        message: "Error al eliminar los usuarios inactivos",
        error: JSON.parse(err.message),
      });
    }
  }

  static async deleteUserByID(req, res) {
    try {
      const { id } = req.params;
      await UsersService.getById(id).catch(() => {
        throw new Error(
          JSON.stringify({ detail: "El usuario no fue encontrado" })
        );
      });
      await UsersService.deleteById({ _id: id });
      return res.sendSuccess({
        message: "El usuario fue eliminado exitosamente",
      });
    } catch (err) {
      return res.sendUserError({
        message: "Error al eliminar el usuario",
        error: JSON.parse(err.message),
      });
    }
  }

  static async uploadDocuments(req, res) {
    try {
      const { id } = req.params;
      const { type } = req.query;
      upload.array("files")(req, res, async (err) => {
        if (err) {
          return res.status(err.statusCode).json({
            message: err.status,
          });
        }
        const fileType = getFiletype(type);
        let user = await UsersService.getById(id);
        if (isEmpty(user)) {
          return res.status(404).json({
            message: "Usuario no encontrado, por favor intente nuevamente.",
          });
        }
        if (!user.documents) {
          user.documents = [];
        }

        const pendingDoc = user.documents.findIndex(
          (doc) => doc.name === "Pendiente subir documentos"
        );
        if (pendingDoc !== -1) {
          user.documents.splice(pendingDoc, 1);
        }

        if (!req.files || req.files.length === 0) {
          return res.status(400).json({
            message: "No files were uploaded.",
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

        const updatedUser = await UsersService.updateUserDoc(
          id,
          user.documents
        );

        return res.status(200).json({
          message: "Documentos subidos exitosamente",
          user: updatedUser,
          documentsStatus: uploadedFiles,
        });
      });
    } catch (err) {
      return res.status(400).json({
        message: "Error al subir los documentos",
        error: err.message,
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
