import { Injectable } from '@angular/core';
import { LoggerService } from '../logger/logger.service';
import { StorageTypeEnum } from './storage-type.enum';

import { environment } from '../../../environments/environment';

/**
 * Service used to handle the application storage
 */
@Injectable()
export class StorageService {

  /**
   * The secret key used to encrypt/decrypt the values during storage operations
   */
  private storageSecretKey = '';

  constructor(
    private loggerService: LoggerService
  ) {
    // Sets the secret key if it has been configured in the environment
    if (environment.storageSecretKey) {
      this.storageSecretKey = environment.storageSecretKey;
    }
  }

  /**
   * Stores the given value, represented by the given key, in the specified storage
   *
   * @param key
   * @param value
   * @param storageType
   */
  public store(key: string, value: any, storageType: StorageTypeEnum): void {
    if (key && key !== '') {
      const encryptedValue = this.encryptObject(value);
      this.loggerService.debug(
        '[' + StorageTypeEnum[storageType] + '] Saving object '
        + key +
        ' on the storage.',
        encryptedValue
      );
      this.getStorage(storageType).setItem(key, encryptedValue);
    }
  }

  /**
   * Retrieves the given value, represented by the given key, in the specified storage
   *
   * @param key
   * @param value
   * @param storageType
   */
  public retrieve(key: string, storageType: StorageTypeEnum): any {
    return this.retrieveOrGetDefault(key, {}, storageType);
  }

  /**
   * Retrieves the given value, represented by the given key, in the specified storage,
   * returning a default value if it is empty
   *
   * @param key
   * @param value
   * @param storageType
   */
  public retrieveOrGetDefault(key: string, defaultValue: any, storageType: StorageTypeEnum): any {
    if (key && key !== '') {
      this.loggerService.debug(
        '[' + StorageTypeEnum[storageType] + '] Retrieving object '
        + key +
        ' from the storage. If it\'s missing, a default value will be returned.',
        + JSON.stringify(defaultValue) + '.');
      const encryptedValue = this.getStorage(storageType).getItem(key);
      if (encryptedValue) {
        return this.decryptObject(encryptedValue, defaultValue);
      }
    }
    return defaultValue;
  }

  /**
   * Removes the given value, represented by the given key, in the specified storage
   *
   * @param key
   * @param value
   * @param storageType
   */
  public remove(key: string, storageType: StorageTypeEnum): void {
    if (key && key !== '') {
      this.loggerService.debug(
        '[' + StorageTypeEnum[storageType] + '] Removing object '
        + key +
        ' from the storage.');
      this.getStorage(storageType).removeItem(key);
    }
  }

  /**
   * Clears all the values stored in each storage
   *
   * @param key
   * @param value
   * @param storageType
   */
  public cleanAll() {
    this.loggerService.debug('Cleaning all storages.');
    this.getStorage(StorageTypeEnum.LOCAL_STORAGE).clear();
    this.getStorage(StorageTypeEnum.SESSION_STORAGE).clear();
  }

  /**
   * Gets the storage identified by the given storage type
   *
   * @param key
   * @param value
   * @param storageType
   */
  private getStorage(storageType: StorageTypeEnum) {
    if (storageType === StorageTypeEnum.SESSION_STORAGE) {
      return sessionStorage;
    } else {
      return localStorage;
    }
  }

  /**
   * Encrypts the given object
   *
   * @param key
   * @param value
   * @param storageType
   */
  private encryptObject(objectToEncrypt: any): string {
    const textToEncrypt = JSON.stringify(objectToEncrypt);
    let insertPosition = 0;
    while (insertPosition === 0 || insertPosition >= textToEncrypt.length) {
      insertPosition = Math.floor(Math.random() * 100);
    }
    return btoa(textToEncrypt.slice(0, insertPosition) + this.storageSecretKey + textToEncrypt.slice(insertPosition));
  }

  /**
   * Decrypts the given value,
   * returning a default if the operation fails
   *
   * @param textToEncrypt
   * @param defaultValue
   */
  private decryptObject(textToEncrypt: any, defaultValue: any) {
    try {
      return JSON.parse(atob(textToEncrypt).replace(this.storageSecretKey, ''));
    } catch (err) {
      this.loggerService.debug('Error during decrypting: ' + textToEncrypt + ', returing default value', err);
      return defaultValue;
    }
  }

}
