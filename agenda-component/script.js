// Clase para representar un nodo en la lista enlazada doble
class DoublyLinkedListNode {
  constructor(nombre, telefono, correo) {
      this.nombre = nombre;
      this.telefono = telefono;
      this.correo = correo;
      this.next = null;
      this.previous = null;
  }
}

// Clase para la lista enlazada doble
class DoublyLinkedList {
  constructor() {
      this.head = null;
      this.tail = null;
  }

  // Insertar contacto en orden alfabético por nombre
  insertByFirstLetter(newNode) {
      if (this.head === null) {
          this.head = newNode;
          this.tail = newNode;
      } else {
          let currentNode = this.head;
          while (
              currentNode !== null &&
              currentNode.nombre.charAt(0).toUpperCase() < newNode.nombre.charAt(0).toUpperCase()
          ) {
              currentNode = currentNode.next;
          }

          if (currentNode === null) {
              this.tail.next = newNode;
              newNode.previous = this.tail;
              this.tail = newNode;
          } else if (currentNode === this.head) {
              newNode.next = this.head;
              this.head.previous = newNode;
              this.head = newNode;
          } else {
              const previousNode = currentNode.previous;
              previousNode.next = newNode;
              newNode.previous = previousNode;
              newNode.next = currentNode;
              currentNode.previous = newNode;
          }
      }
  }

  // Mostrar todos los contactos
  displayContacts() {
      let currentNode = this.head;
      const contactos = [];
      while (currentNode !== null) {
          contactos.push({
              nombre: currentNode.nombre,
              telefono: currentNode.telefono,
              correo: currentNode.correo,
          });
          currentNode = currentNode.next;
      }
      return contactos;
  }

  // Buscar contactos por la inicial del nombre
  searchByFirstLetter(targetLetter) {
      let currentNode = this.head;
      const foundNodes = [];
      while (currentNode !== null) {
          const firstInitialName = currentNode.nombre.charAt(0).toUpperCase();
          if (firstInitialName === targetLetter.toUpperCase()) {
              foundNodes.push(currentNode);
          }
          currentNode = currentNode.next;
      }
      return foundNodes;
  }

  // Eliminar contacto por inicial del nombre y número de teléfono
  deleteByInitialAndPhone(initial, targetPhone) {
      let currentNode = this.head;
      while (currentNode !== null) {
          const firstInitialName = currentNode.nombre.charAt(0).toUpperCase();
          if (
              firstInitialName === initial.toUpperCase() &&
              currentNode.telefono === targetPhone
          ) {
              const nodeToDelete = currentNode;
              if (nodeToDelete === this.head && nodeToDelete === this.tail) {
                  this.head = null;
                  this.tail = null;
              } else if (nodeToDelete === this.head) {
                  this.head = nodeToDelete.next;
                  this.head.previous = null;
              } else if (nodeToDelete === this.tail) {
                  this.tail = nodeToDelete.previous;
                  this.tail.next = null;
              } else {
                  nodeToDelete.previous.next = nodeToDelete.next;
                  nodeToDelete.next.previous = nodeToDelete.previous;
              }
              alert(`Contacto eliminado: ${nodeToDelete.nombre}`);
              return;
          }
          currentNode = currentNode.next;
      }
      alert("No se encontró el contacto con esa inicial y teléfono.");
  }
}

$(function () {
  const agenda = new DoublyLinkedList();

  // Renderizar la lista de contactos
  function renderLista(contactos) {
      $("#tableBody").empty();
      contactos.forEach((contacto) => {
          const row = `<tr>
              <td>${contacto.nombre}</td>
              <td>${contacto.telefono}</td>
              <td>${contacto.correo}</td>
          </tr>`;
          $("#tableBody").append(row);
      });
  }

  // Generar tablero dinámico de letras
  function generateAlphabetNav() {
      const alphabetNav = $("#alphabetNav");
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

      alphabet.split("").forEach((letter) => {
          const button = $(`<button class="btn btn-warning m-1">${letter}</button>`);
          button.on("click", () => {
              const results = agenda.searchByFirstLetter(letter);
              renderLista(
                  results.map((node) => ({
                      nombre: node.nombre,
                      telefono: node.telefono,
                      correo: node.correo,
                  }))
              );
          });
          alphabetNav.append(button);
      });

      const allButton = $('<button class="btn btn-warning m-1">Todos</button>');
      allButton.on("click", () => renderLista(agenda.displayContacts()));
      alphabetNav.append(allButton);
  }

  // Agregar contacto
  $("#addBtn").on("click", function () {
      const nombre = $("#valueInput").val().trim();
      const telefono = $("#indexInput").val().trim();
      const correo = $("#emailInput").val().trim();

      const nameRegex = /^[a-zA-Z\s]+$/;
      const phoneRegex = /^\d{10}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!nameRegex.test(nombre)) {
          alert("El nombre debe contener solo letras.");
          return;
      }

      if (!phoneRegex.test(telefono)) {
          alert("El teléfono debe contener solo números y tener 10 dígitos.");
          return;
      }

      if (!emailRegex.test(correo)) {
          alert("El correo electrónico debe ser válido.");
          return;
      }

      const confirmAdd = confirm(
          `¿Desea agregar este contacto?\nNombre: ${nombre}\nTeléfono: ${telefono}\nCorreo: ${correo}`
      );

      if (confirmAdd) {
          const newNode = new DoublyLinkedListNode(nombre, telefono, correo);
          agenda.insertByFirstLetter(newNode);
          renderLista(agenda.displayContacts());

          $("#valueInput").val("").focus();
          $("#indexInput").val("");
          $("#emailInput").val("");
      }
  });

  // Eliminar contacto
  $("#deleteBtn").on("click", function () {
      const initial = prompt("Introduce la inicial del nombre:");
      if (!initial) return;

      const filteredContacts = agenda.searchByFirstLetter(initial);
      if (filteredContacts.length === 0) {
          alert("No se encontraron contactos con esa inicial.");
          return;
      }

      const phone = prompt("Introduce el número de teléfono del contacto a eliminar:");
      if (!phone) return;

      const confirmDelete = confirm(
          `¿Está seguro de que desea eliminar el contacto con inicial "${initial}" y número "${phone}"?`
      );

      if (confirmDelete) {
          agenda.deleteByInitialAndPhone(initial, phone);
          renderLista(agenda.displayContacts());
      }
  });

  // Generar el tablero de letras al cargar la página
  generateAlphabetNav();
});