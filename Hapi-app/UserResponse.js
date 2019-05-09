class UserResponseStatus {
  constructor(message,addressInput) {
      this.address= addressInput,
      this.requestTimeStamp= "",
      this.message= message,
      this.validationWindow= 0,
      this.messageSignature= ""
    }
}
class UserResponse {
    constructor(status, registerStar) {
      this.registerStar= registerStar,
      this.status=status
    }
}
module.exports = {   UserResponse: UserResponse, UserResponseStatus:UserResponseStatus
}
