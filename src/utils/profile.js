import { rgbToHex } from './style';

export const getProfileImage = (user, rgbText, rgbBackgroundLight) => {
  const avatarBgColor = rgbToHex(rgbText).slice(1);
  const avatarColor = rgbToHex(rgbBackgroundLight).slice(1);

  const displayName = user?.displayName;
  const photoUrl = user?.photoURL;

  if (photoUrl) {
    return photoUrl;
  }

  const defaultPhotoUrl = `https://ui-avatars.com/api/?name=${displayName?.charAt(
    0
  )}&background=${avatarBgColor}&color=${avatarColor}`;

  return defaultPhotoUrl;
};
