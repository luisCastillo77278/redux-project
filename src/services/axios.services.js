import { customFetch } from "../axios"
export const refreshToken = async () => {
  try {
    const resp = await customFetch.get('auth/refres')
    console.log(resp.data)
    return resp.data
  } catch (err) {
    console.log(err)
  }
}