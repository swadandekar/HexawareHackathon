class Client {
  constructor(storyInput) {
    this.TIN = "",
    this.DisplayName ="",
    this.comment =storyInput
  }
}

class ClientBody {
  constructor(address, objClient) {
    this.address= address,
    this.client =objClient
  }
}
module.exports = {   Client: Client,ClientBody: ClientBody
}
