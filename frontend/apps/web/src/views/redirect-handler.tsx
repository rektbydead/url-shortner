import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { z } from "zod"
import { UrlShortenService } from "@/services/url-shorten-service"

export default function RedirectHandler() {
  const { uuid } = useParams()
  const navigate = useNavigate()

  /*
   * This could be replaced with a 301 or 302 http code returned by the backend.
  */

  useEffect(() => {
    const result = z.uuidv4().safeParse(uuid)

    if (!result.success) {
      navigate("/", { replace: true })
      return
    }

    UrlShortenService.get(result.data)
      .then(({ original_url }) => window.location.href = original_url)
      .catch(() => navigate("/", { replace: true }))
  }, [uuid, navigate])

  return null
}
