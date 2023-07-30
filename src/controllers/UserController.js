import UsersService from "../services/users.service.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import __dirname from "../config/utils.js";
import isEmpty from "is-empty";

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
      const role = req.body.role.toLowerCase();
      if (user.role === role) {
        throw new Error(
          JSON.stringify({ detail: "El rol del usuario no puede ser el mismo" })
        );
      }
      user.role = role;
      await user.save();
      return res.sendSuccess({
        message: "El rol del usuario fue actualizado exitosamente",
      });
    } catch (err) {
      return res.sendUserError({
        message: "Error al actualizar el rol del usuario",
        error: JSON.parse(err.message),
      });
    }
  }

  static async deleteInactiveUsers(req, res) {
    try {
      const dosDiasAtras = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      const user = await UsersService.get().catch(() => {
        throw new Error(
          JSON.stringify({ detail: "No se encontraron usuarios" })
        );
      });
      console.log("🚀 ~ file: UserController.js:110 ~ UserController ~ deleteInactiveUsers ~ user:", user)
      let inactiveUsers = user.filter( (user) => user.last_connection < dosDiasAtras );

      const emailsInactiveUsers = inactiveUsers.map((user) => user.email);

      if (isEmpty(inactiveUsers)) {
        throw new Error(
          JSON.stringify({ detail: "No se encontraron usuarios inactivos" })
        );
      }
      await UsersService.deleteMany({
        last_connection: { $lte: dosDiasAtras },
      });
      return res.sendSuccess({
        message: `Los siguentes usuarios: [ ${emailsInactiveUsers} ]  fueron eliminados por 2 dias de inactividad:  `,
      });
    } catch (err) {
      return res.sendUserError({
        message: "Error al eliminar los usuarios inactivos",
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
  
        const pendingDoc = user.documents.findIndex((doc) => doc.name === "Pendiente subir documentos");
        if (pendingDoc !== -1) {
          user.documents.splice(pendingDoc, 1);
        }
  
        const uploadedFiles = req.files.map((file) => {
          const newName = file.originalname.split('.')[0];
          const isDuplicate = user.documents.some((doc) => doc.name === newName);
          if (isDuplicate) {
            return {
              name: newName,
              status: "Archivo repetido",
            };
          } else {
            user.documents.push({
              name: newName,
              reference: `/uploads/${fileType.name}/${file.filename}`,
            });
            return {
              name: newName,
              status: "Archivo subido exitosamente",
            };
          }
        });
  
        const updatedUser = await UsersService.updateUserDoc(id, user.documents);
  
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

// Función auxiliar para obtener el tipo del archivo
function getFiletype(type) {
  switch (type) {
    case "profile":
      return "profile";
    case "product":
      return "product";
    default:
      return "document";
  }
}

export default UserController;
