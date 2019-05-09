class UserRequest {
  constructor(addressInput) {
    this.address = addressInput,
    this.requestTimeStamp =0,
    this.message ="",
    this.validationWindow=""
  }
}

module.exports = {   UserRequest: UserRequest,
}
