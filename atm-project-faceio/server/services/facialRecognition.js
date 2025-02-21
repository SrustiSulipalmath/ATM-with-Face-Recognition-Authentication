// class FacialRecognition {
//     async register(image) {
//         // Implementation for your chosen face API
//         // Example using FaceIO:
//         const faceId = await fio_api.register({
//             image: image,
//             subjectId: uuidv4()
//         });
//         return faceId;
//     }

//     async verify(image) {
//         // Implementation for verification
//         const result = await fio_api.verify(image);
//         return result;
//     }
// }

// module.exports = new FacialRecognition();

// const faceIO = require('faceio'); // Make sure to install this

// const axios = require('axios');

// class FacialRecognition {
//     constructor() {
//         this.fio = new faceIO("YOUR_FACEIO_PUBLIC_ID");
//     }

//     async register(userId,image) {
//         try {
//             const response = await this.fio.enroll({
//                 "locale": "auto",
//                 "payload": {
//                     "userId":userId,
//                     "image": image
//                 }
//             });
//             return response.facialId;
//         } catch (error) {
//             throw new Error('Face registration failed: ' + error);
//         }
//     }

//     async verify(image) {
//         try {
//             const response = await this.fio.authenticate({
//                 "locale": "auto",
//                 "image": image
//             });
//             return {
//                 success: true,
//                 userId: response.payload.userId,
//                 confidence: response.confidence
//             };
//         } catch (error) {
//             return { success: false };
//         }
//     }
// }

// module.exports = new FacialRecognition();

// services/facialRecognition.js
const axios = require('axios');

class FacialRecognition {
  constructor() {
    this.apiKey = process.env.FACEIO_API_KEY;
    this.baseURL = 'https://api.face.io/v1';
  }

  async register(image) {
    try {
      const response = await axios.post(`${this.baseURL}/enroll`, {
        image: image,
        metadata: {
          userId: "" // Will be set during registration
        }
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      return response.data.facialId;
    } catch (error) {
      throw new Error('Face registration failed: ' + error.response.data.error);
    }
  }

  async verify(image) {
    try {
      const response = await axios.post(`${this.baseURL}/authenticate`, {
        image: image
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return {
        success: true,
        userId: response.data.metadata.userId,
        confidence: response.data.confidence
      };
    } catch (error) {
      return { 
        success: false,
        error: error.response.data.error 
      };
    }
  }
}

module.exports = new FacialRecognition();
console.log('Facial recognition service:', facialRecognition);
