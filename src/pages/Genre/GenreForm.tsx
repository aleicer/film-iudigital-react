// components/GenreForm.tsx
import { useState, useEffect } from 'react';
import { GenreType } from '../../types/Genre';
import {
  Button,
  Input,
  Checkbox,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@nextui-org/react";

interface GenreFormProps {
  currentGenre: GenreType | null;
  isEditing: boolean;
  onClose: () => void;
  onSuccess: () => void;
  createGenre: (genre: Omit<GenreType, '_id' | 'createdAt' | 'updatedAt' | '__v'>) => Promise<GenreType>;
  updateGenre: (genre: GenreType) => Promise<GenreType>;
}

export default function GenreForm({ currentGenre, isEditing, onClose, onSuccess, createGenre, updateGenre }: GenreFormProps) {
  const [genre, setGenre] = useState<GenreType>({
    _id: '',
    name: '',
    status: 'inactivo',
    description: '',
  });

  useEffect(() => {
    if (currentGenre) {
      setGenre(currentGenre);
    }
  }, [currentGenre]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEditing) {
      await updateGenre(genre);
    } else {
      const { _id, ...newGenre } = genre 
      await createGenre(newGenre);
    }
    onSuccess(); // Llamamos a onSuccess para refrescar la lista y cerrar el modal
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>{isEditing ? 'Editar Género' : 'Agregar Nuevo Género'}</ModalHeader>
          <ModalBody>
            <Input
              label="Nombre"
              value={genre.name}
              onChange={(e) => setGenre({ ...genre, name: e.target.value })}
              required
            />
            <Input
              label="Descripción"
              value={genre.description}
              onChange={(e) => setGenre({ ...genre, description: e.target.value })}
              required
            />
            <Checkbox
              isSelected={genre.status.toLowerCase() === 'activo'}
              onValueChange={(value) => setGenre({ ...genre, status: value ? 'activo' : 'inactivo' })}
            >
              Activo
            </Checkbox>
            {/* Otros campos adicionales */}
          </ModalBody>
          <ModalFooter>
            <Button onPress={onClose}>Cancelar</Button>
            <Button type="submit">{isEditing ? 'Actualizar' : 'Crear'}</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
