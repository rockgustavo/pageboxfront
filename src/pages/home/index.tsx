import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./Home.module.css";

interface File {
  id: number;
  name: string;
  content: string;
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
      setNewFolderName("");
      setShowCreateFolder(false);
      setParentForNewFolder(null);
      loadDirectories();
    } catch (error) {
      console.error("Erro ao criar diretório:", error);
    }
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

  // Função para renderizar subdiretórios de forma recursiva
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
          renderSubDirectories={renderSubDirectories} // Passar a função renderSubDirectories
        />
      ));
  };

  return (
    <div className="home">
      <h1>Gerenciamento de Pastas</h1>

      <div className="create-folder-root">
        <div
          className={styles["folder-add"]}
          onClick={() => handleAddSubFolder(null)}
        />
        {showCreateFolder && (
          <div className="create-folder-form">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Nome da nova pasta"
            />
            <button onClick={createFolder}>Criar</button>
          </div>
        )}
      </div>

      <div className="directory-list">
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
            />
          ))}
      </div>

      {deleteFolderId && (
        <div className="delete-confirmation">
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
  renderSubDirectories, // Adiciona renderSubDirectories como uma propriedade
}: {
  directory: DirectoryDTO;
  expandedDirectories: number[];
  toggleFolder: (id: number) => void;
  confirmDeleteFolder: (id: number) => void;
  handleAddSubFolder: (parentId: number) => void;
  renderSubDirectories: (parentId: number) => JSX.Element[]; // Definir o tipo de renderSubDirectories
}) {
  const isExpanded = expandedDirectories.includes(directory.id!);

  return (
    <div className="directory-item">
      <div className="directory-header">
        <div
          className={
            isExpanded ? styles["folder-open"] : styles["folder-closed"]
          }
          onClick={() => toggleFolder(directory.id!)}
          style={{ cursor: "pointer" }}
        >
          <span>{directory.name}</span>
        </div>

        {/* Botão de adicionar subpasta */}
        <div
          className={styles["folder-add"]}
          onClick={() => handleAddSubFolder(directory.id!)}
        />

        {/* Botão de excluir pasta */}
        <div
          className={styles["folder-erase"]}
          onClick={() => confirmDeleteFolder(directory.id!)}
        />
      </div>

      {/* Renderizar arquivos e subpastas se o diretório estiver expandido */}
      {isExpanded && (
        <div className="directory-content">
          {directory.files?.map((file) => (
            <div key={file.id} className="file-item">
              <span>{file.name}</span>
            </div>
          ))}
          {/* Renderizar subpastas */}
          {renderSubDirectories(directory.id!)} {/* Renderiza subdiretórios */}
        </div>
      )}
    </div>
  );
}
