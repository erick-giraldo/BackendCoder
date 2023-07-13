import UsersService from "../services/users.service.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const { id } = req.params;
      const { type } = req.query;
      let folder;
      if (type === "profile") {
        folder = "profiles";
      } else if (type === "product") {
        folder = "products";
      } else {
        folder = "documents";
      }
      const destinationFolder = `uploads/${folder}/${id}`;
      // Crear la carpeta de destino si no existe
      fs.mkdirSync(destinationFolder, { recursive: true });
      cb(null, destinationFolder);
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
      const users = await UsersService.get().catch(() => {
        throw new Error(
          JSON.stringify({ detail: "No se encontraron usuarios" })
        );
      });
      return res.status(200).json(users);
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
        return res.json({
          message: "El rol del usuario no puede ser el mismo",
        });
      }
      user.role = role;
      await user.save();
      return res.json({
        message: "El rol del usuario fue actualizado exitosamente",
      });
    } catch (err) {
      return res.status(400).json({
        message: "Error al actualizar el rol del usuario",
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
          throw new Error(err.message);
        }

        const fileType = getFiletype(type);

        const payload = req.files.map((file) => {
            return {
                name: file.filename,
                path: file.path,
                type: fileType,
            };
        });

        await UsersService.updateDocumentStatus(id, payload).catch(
          () => {
            throw new Error("Error al actualizar el status del documento");
          }
        );

        return res.status(200).json({
          message: "Documentos subidos exitosamente",
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
    case "profiles":
      return "profiles";
    case "products":
      return "producto";
    default:
      return "documents";
  }
}

export default UserController;