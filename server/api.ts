class Api {
  static #baseUrl = "http://localhost:5000"

  static async getTodos() {
    const response = await fetch(`${Api.#baseUrl}/transactions`)
    return await response.json()
  }

}

export default Api;

