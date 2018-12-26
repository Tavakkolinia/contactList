//contact class represents a contact
class Contact {
  constructor(name, email, contactNumber) {
    this.name = name;
    this.email = email;
    this.contactNumber = contactNumber;
  }
}

//ui class to handle ui tasks
class UI {
  static displayContacts() {
    const contacts = Store.getContacts();

    contacts.forEach(contact => UI.addContactToList(contact));
  }
  static addContactToList(contact) {
    const list = document.querySelector('#contact-list');

    const row = document.createElement('tr');

    row.innerHTML = `
    <td>${contact.name}</td>
    <td>${contact.email}</td>
    <td>${contact.contactNumber}</td>
    <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>

    `;

    list.appendChild(row);
  }
  static deleteContact(el) {
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }
  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#contact-form');
    container.insertBefore(div, form);
    //disappear in 5 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 5000);
  }

  static clearFields() {
    document.querySelector('#name').value = '';
    document.querySelector('#email').value = '';
    document.querySelector('#contactNumber').value = '';
  }
}

//store class handles storage

class Store {
  static getContacts() {
    let contacts;
    if (localStorage.getItem('contacts') === null) {
      contacts = [];
    } else {
      contacts = JSON.parse(localStorage.getItem('contacts'));
    }

    return contacts;
  }
  static addContact(contact) {
    const contacts = Store.getContacts();
    contacts.push(contact);
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }
  static removeContact(contactNumber) {
    const contacts = Store.getContacts();
    contacts.forEach((contact, index) => {
      if (contact.contactNumber === contactNumber) {
        contacts.splice(index, 1);
      }
    });
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }
}

//events to display contacts
document.addEventListener('DOMContentLoaded', UI.displayContacts);

//event add a contact
document.querySelector('#contact-form').addEventListener('submit', e => {
  e.preventDefault();
  //get form values
  const name = document.querySelector('#name').value;
  const email = document.querySelector('#email').value;
  const contactNumber = document.querySelector('#contactNumber').value;
  //validate

  if (name === '' || email === '' || contactNumber === '') {
    UI.showAlert('Please fill in all fields', 'danger');
  } else {
    // instantiate contact
    const contact = new Contact(name, email, contactNumber);

    //add contact to ui
    UI.addContactToList(contact);

    //add contact to store
    Store.addContact(contact);
    //show success message

    UI.showAlert('Contact added', 'success');
    //clear fields
    UI.clearFields();
  }
});
//event to delete a contact
document.querySelector('#contact-list').addEventListener('click', e => {
  UI.deleteContact(e.target);
  //remove contact from store
  Store.removeContact(
    e.target.parentElement.previousElementSibling.textContent
  );
  UI.showAlert('Contact deleted', 'success');
});
