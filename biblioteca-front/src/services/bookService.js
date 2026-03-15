const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getBooks = async () => {
  try {
    const response = await fetch(`${API_URL}/books`);
    if (!response.ok) {
      throw new Error('Error al obtener los libros');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en getBooks:', error);
    throw error;
  }
};

export const getBookById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/books/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener el libro');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en getBookById:', error);
    throw error;
  }
};

export const createBook = async (bookData) => {
  try {
    const response = await fetch(`${API_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookData)
    });
    if (!response.ok) {
      throw new Error('Error al crear el libro');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en createBook:', error);
    throw error;
  }
};

export const updateBook = async (id, bookData) => {
  try {
    const response = await fetch(`${API_URL}/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookData)
    });
    if (!response.ok) {
      throw new Error('Error al actualizar el libro');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en updateBook:', error);
    throw error;
  }
};

export const deleteBook = async (id) => {
  try {
    const response = await fetch(`${API_URL}/books/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Error al eliminar el libro');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en deleteBook:', error);
    throw error;
  }
};
