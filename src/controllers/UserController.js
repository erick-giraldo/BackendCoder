import UsersService from "../services/users.service.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import __dirname from "../config/utils.js";

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
    const destinationFolder = path.join(
      __dirname,
      "../public/uploads",
      folder,
      id
    );

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
  
        // Obtén el documento existente del usuario
        let user = req.user || (await UsersService.getById(id));
  
        // Inicializa user.documents como un array vacío si no existe
        if (!user.documents) {
          user.documents = [];
        }
       // cambiar el metodo some por find 
        // Verifica si el tipo de archivo ya está agregado en el array de documentos
        const documentExists = user.documents.some((doc) => doc.name === fileType.name);
        console.log("🚀 ~ file: UserController.js:97 ~ upload.array ~ documentExists:", documentExists)
  
        // Si no existe, agrégalo al array de documentos
        if (!documentExists) {
          user.documents.push(fileType);
        }
  
        // Actualiza el documento en la base de datos
        const updatedUser = await UsersService.updateUserDoc(id, user.documents);
  
        return res.status(200).json({
          message: "Documentos subidos exitosamente",
          user: updatedUser,
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
      return {
        "name": "profile",
      };
    case "products":
      return {
        "name": "product",
      };
    default:
      return {
        "name": "document",
      };
  }
}

export default UserController;
