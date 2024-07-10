export async function findLocation() {
  if (!navigator.geolocation) {
    return "Ваш браузер не дружит с геолокацией...";
  } else {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (data) => resolve(data),
          (err) => reject(err),
          { enableHighAccuracy: true },
        );
      });

      const { latitude, longitude } = position.coords;
      return `[${latitude}, ${longitude}]`;
    } catch (err) {
      console.log(err);
    }
  }
}
