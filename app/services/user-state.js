import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class UserStateService extends Service {

  @tracked state = new Map();

  // Specific getter for ID
  get id() {
    return this.state.get('id');
  }

  // Helper method
  hasId() {
    return this.state.has('id');
  }

  get(key) {
    return this.state.get(key);
  }

  add(key, value) {
    this.state.set(key, value);
  }

  remove(key) {
    this.state.delete(key);
  }

  empty() {
    this.state.clear();
  }
}
