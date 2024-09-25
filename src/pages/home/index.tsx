import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./Home.module.css";

interface File {
  id: number;
  name: string;
  content: string;
  directory: { id: number }; // Ajustado para enviar apenas o id do diretório
}

interface DirectoryDTO {
  id?: number;
  name: string;
  parentDirectory?: Pick<DirectoryDTO, "id"> | null;
  files?: File[];
}

export function Home() {
  const [directories, setDirectories] = useState<DirectoryDTO[]>([]);
  const [expandedDirectories, setExpandedDirectories] = useState<number[]>([]);
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [showCreateFolder, setShowCreateFolder] = useState<boolean>(false);
  const [deleteFolderId, setDeleteFolderId] = useState<number | null>(null);
  const [parentForNewFolder, setParentForNewFolder] = useState<number | null>(
    null
  );

  useEffect(() => {
    loadDirectories();
  }, []);

  const loadDirectories = async () => {
    try {
      const response = await axios.get<DirectoryDTO[]>(
        "http://localhost:8080/api/diretorio"
      );
      setDirectories(response.data);
    } catch (error) {
      console.error("Erro ao buscar diretórios:", error);
    }
  };

  const handleAddSubFolder = (parentId: number | null) => {
    setShowCreateFolder(true);
    setParentForNewFolder(parentId);
    setNewFolderName(""); // Limpa o nome da nova pasta ao abrir o pop-up
  };

  const createFolder = async () => {
    if (newFolderName.trim() === "") {
      alert("O nome da pasta não pode estar em branco.");
      return;
    }

    const newDirectory: DirectoryDTO = {
      name: newFolderName,
      parentDirectory: parentForNewFolder ? { id: parentForNewFolder } : null,
    };

    try {
      await axios.post("http://localhost:8080/api/diretorio", newDirectory);
      loadDirectories(); // Atualiza a lista de diretórios
    } catch (error) {
      console.error("Erro ao criar diretório:", error);
    }
    setShowCreateFolder(false); // Fecha o pop-up
  };

  const toggleFolder = (folderId: number) => {
    if (expandedDirectories.includes(folderId)) {
      setExpandedDirectories(
        expandedDirectories.filter((id) => id !== folderId)
      );
    } else {
      setExpandedDirectories([...expandedDirectories, folderId]);
    }
  };

  const confirmDeleteFolder = (folderId: number) => {
    setDeleteFolderId(folderId);
  };

  const deleteFolder = async (folderId: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/diretorio/${folderId}`);
      setDeleteFolderId(null);
      loadDirectories();
    } catch (error) {
      console.error("Erro ao deletar diretório:", error);
    }
  };

  const renderSubDirectories = (parentId: number) => {
    return directories
      .filter((dir) => dir.parentDirectory?.id === parentId)
      .map((dir) => (
        <DirectoryItem
          key={dir.id}
          directory={dir}
          expandedDirectories={expandedDirectories}
          toggleFolder={toggleFolder}
          confirmDeleteFolder={confirmDeleteFolder}
          handleAddSubFolder={handleAddSubFolder}
          renderSubDirectories={renderSubDirectories}
          loadDirectories={loadDirectories}
        />
      ));
  };

  return (
    <div className={styles.home}>
      <h1>Gerenciamento de Pastas</h1>

      <div className={styles["create-folder-root"]}>
        <div
          className={styles["folder-add-top"]}
          onClick={() => handleAddSubFolder(null)}
        />
      </div>

      {showCreateFolder && (
        <div className={styles["delete-confirmation"]}>
          <p>Digite o nome da nova pasta:</p>
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Nome da nova pasta"
          />
          <button onClick={createFolder}>Criar</button>
          <button onClick={() => setShowCreateFolder(false)}>Cancelar</button>
        </div>
      )}

      <div className={styles["directory-list"]}>
        {directories
          .filter((dir) => dir.parentDirectory === null)
          .map((dir) => (
            <DirectoryItem
              key={dir.id}
              directory={dir}
              expandedDirectories={expandedDirectories}
              toggleFolder={toggleFolder}
              confirmDeleteFolder={confirmDeleteFolder}
              handleAddSubFolder={handleAddSubFolder}
              renderSubDirectories={renderSubDirectories}
              loadDirectories={loadDirectories}
            />
          ))}
      </div>

      {/* Modal de Confirmação para Deletar Pasta */}
      {deleteFolderId && (
        <div className={styles["delete-confirmation"]}>
          <p>Tem certeza que deseja excluir esta pasta?</p>
          <button onClick={() => deleteFolder(deleteFolderId)}>
            Confirmar
          </button>
          <button onClick={() => setDeleteFolderId(null)}>Cancelar</button>
        </div>
      )}
    </div>
  );
}

// Componente para renderizar uma pasta e seus arquivos
function DirectoryItem({
  directory,
  expandedDirectories,
  toggleFolder,
  confirmDeleteFolder,
  handleAddSubFolder,
  renderSubDirectories,
  loadDirectories,
}: {
  directory: DirectoryDTO;
  expandedDirectories: number[];
  toggleFolder: (id: number) => void;
  confirmDeleteFolder: (id: number) => void;
  handleAddSubFolder: (parentId: number) => void;
  renderSubDirectories: (parentId: number) => JSX.Element[];
  loadDirectories: () => void;
}) {
  const isExpanded = expandedDirectories.includes(directory.id!);
  const [fileToEdit, setFileToEdit] = useState<File | null>(null);
  const [newFileName, setNewFileName] = useState<string>("");
  const [newFileContent, setNewFileContent] = useState<string>("");
  const [deleteFileId, setDeleteFileId] = useState<number | null>(null);

  const handleEditFile = (file: File) => {
    setFileToEdit(file);
    setNewFileName(file.name);
    setNewFileContent(file.content);
  };

  const saveEditedFile = async () => {
    if (!fileToEdit) return;

    const updatedFile = {
      id: fileToEdit.id,
      name: newFileName,
      content: newFileContent,
      directory: { id: directory.id! },
    };

    try {
      await axios.put(
        `http://localhost:8080/api/arquivo/${fileToEdit.id}`,
        updatedFile
      );
      loadDirectories();
      setFileToEdit(null);
    } catch (error) {
      console.error("Erro ao atualizar arquivo:", error);
    }
  };

  const confirmDeleteFile = () => {
    if (!fileToEdit) return;

    setDeleteFileId(fileToEdit.id);
  };

  const deleteFile = async (fileId: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/arquivo/${fileId}`);
      setDeleteFileId(null);
      loadDirectories();
      setFileToEdit(null);
    } catch (error) {
      console.error("Erro ao deletar arquivo:", error);
    }
  };

  return (
    <div className={styles["directory-item"]}>
      <div className={styles["directory-header"]}>
        <div
          className={
            isExpanded ? styles["folder-open"] : styles["folder-closed"]
          }
          onClick={() => toggleFolder(directory.id!)}
          style={{ cursor: "pointer" }}
        >
          <span>{directory.name}</span>
        </div>

        <div
          className={styles["file-add"]}
          style={{
            cursor: "pointer",
            margin: "0 10px 10px 0",
          }}
          onClick={() => handleAddSubFolder(directory.id!)}
        />
        <div
          className={styles["folder-add"]}
          style={{ cursor: "pointer" }}
          onClick={() => handleAddSubFolder(directory.id!)}
        />
        <div
          className={styles["folder-erase"]}
          style={{ cursor: "pointer" }}
          onClick={() => confirmDeleteFolder(directory.id!)}
        />
      </div>
      <hr />

      {isExpanded && (
        <div className={styles["directory-content"]}>
          {directory.files?.map((file) => (
            <div
              key={file.id}
              className={styles["file-item"]}
              style={{ cursor: "pointer" }}
              onClick={() => handleEditFile(file)}
            >
              <span>{file.name}</span>
            </div>
          ))}
          {renderSubDirectories(directory.id!)} {/* Renderiza subdiretórios */}
          {fileToEdit && (
            <div className={styles["edit-file-form"]}>
              <h2>Editar Arquivo</h2>
              <label>
                Nome:
                <input
                  className={styles["edit-file-name"]}
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                />
              </label>
              <label>
                Conteúdo:
                <textarea
                  className={styles["edit-file-content"]}
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                />
              </label>
              <button onClick={saveEditedFile}>Salvar Alterações</button>
              <button onClick={() => confirmDeleteFile()}>
                Excluir Arquivo
              </button>
              <button onClick={() => setFileToEdit(null)}>Cancelar</button>
            </div>
          )}
          {/* Modal de Confirmação para Deletar Arquivo */}
          {deleteFileId && (
            <div className={styles["delete-confirmation"]}>
              <p>Tem certeza que deseja excluir este arquivo?</p>
              <button onClick={() => deleteFile(deleteFileId)}>
                Confirmar
              </button>
              <button onClick={() => setDeleteFileId(null)}>Cancelar</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
