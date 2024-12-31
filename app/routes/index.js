import Route from '@ember/routing/route';
import ENV from 'website-my/config/environment';
import { inject as service } from '@ember/service';
import { toastNotificationTimeoutOptions } from '../constants/toast-notification';
import { USER_STATES } from '../constants/user-status';
import redirectAuth from '../utils/redirect-auth';
const API_BASE_URL = ENV.BASE_API_URL;
export default class IndexRoute extends Route {
  @service toast;
  @service userState;

  model = async () => {
    // Using hasId() to check if ID exists
    if (!this.userState.hasId()) {
      this.toast.error('User ID not found');
      return USER_STATES.DNE;
    }

    // Using id getter instead of getting from parent model
    const userId = this.userState.id;

    try {
      const response = await fetch(`${API_BASE_URL}/users/status/${userId}`, {
        credentials: 'include',
      });
      const userData = await response.json();
      if (response.status === 200) {
        return userData?.data?.currentStatus?.state ?? USER_STATES.DNE;
      } else if (response.status === 401) {
        this.toast.error(
          'You are not logged in. Please login to continue.',
          '',
          toastNotificationTimeoutOptions
        );
        // added setTimeout here because before new page opens user should be notified of error by toast
        setTimeout(redirectAuth, 2000);
      } else if (response.status === 404) {
        this.toast.error(
          `Your Status data doesn't exist yet. Please choose your status from the options below.`,
          '',
          toastNotificationTimeoutOptions
        );
        return USER_STATES.DNE;
      }
    } catch (error) {
      console.error(error.message);
    }
  };
}
