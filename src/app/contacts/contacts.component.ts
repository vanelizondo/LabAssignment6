import { Component, OnInit } from '@angular/core';

import { Contact } from './contacts.model';
import { HttpClient } from '@angular/common/http';
import { async } from '@angular/core/testing';


@Component({
  selector: 'contact',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  contacts: Array<Contact> = [];
  contactParams = '';
  constructor(private http: HttpClient) { }

  async ngOnInit() {

    this.contacts = await this.loadItemsFromFile();

  }

  async loadContacts() {
    const savedContacts = this.getItemsFromLocalStorage('contacts');
    if (savedContacts && savedContacts.length > 0) {
      this.contacts = savedContacts;
    } else {
      this.contacts = await this.loadItemsFromFile();
    }

    this.sortByID(this.contacts);
  }

  async loadItemsFromFile() {
    const data = await this.http.get('assets/contacts.json').toPromise();
    return data.json();

  }

  addContact() {
    this.contacts.unshift(new Contact({}));
  }

  deleteContact(index: number) {
    this.contacts.splice(index, 1);
    this.saveItemsToLocalStorage(this.contacts);
  }

  saveContact(contact: any) {
    contact.editing = false;
    this.saveItemsToLocalStorage(this.contacts);
  }

  saveItemsToLocalStorage(contacts: Array<Contact>) {
    contacts = this.sortByID(contacts);
    const savedContacts = localStorage.setItem('contacts', JSON.stringify(contacts));
    return savedContacts;
  }

  getItemsFromLocalStorage(key: string) {
    const savedContacts = JSON.parse(localStorage.getItem(key));
    return savedContacts;
  }

  searchContact(params: string) {

    this.contacts = this.contacts.filter((item: Contact) => {
      const fullName = item.firstName + ' ' + item.lastName;

      if (params === fullName || params === item.firstName || params === item.lastName) {
        return true;
      } else {
        return false;
      }
    });
  }

  sortByID(contacts: Array<Contact>) {
    contacts.sort((prevContact: Contact, presContact: Contact) => {
      return prevContact.id < presContact.id ? 1 : -1;
    });
    return contacts;
  }

}
