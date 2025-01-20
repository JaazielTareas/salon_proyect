export default function Footer() {
    return (
      <footer className="bg-gray-800 text-gray-100 py-8 px-8" >
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          {/* Información del Salón */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-semibold">Salón de Belleza "La Puca"</h3>
            <p className="mt-2">Te ayudamos a lucir espectacular. 💅✨</p>
            <p className="mt-1">Horario: Lunes a Sábado, 9:00 AM - 7:00 PM</p>
          </div>
  
          {/* Formas de Contacto */}
          <div className="mb-6 md:mb-0">
            <h4 className="text-lg font-medium">Contáctanos</h4>
            <ul className="mt-2 space-y-1">
              <li>
                <a
                  href="tel:+123456789"
                  className="hover:underline flex items-center"
                >
                  📞 Teléfono: +1 (234) 567-89
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@lapuca.com"
                  className="hover:underline flex items-center"
                >
                  ✉️ Correo: Salonlapuca@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://goo.gl/maps/example"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center"
                >
                  📍 Dirección: Av. Belleza #123, Ciudad Estilo
                </a>
              </li>
            </ul>
          </div>
  
          {/* Redes Sociales */}
          <div>
            <h4 className="text-lg font-medium">Síguenos</h4>
            <div className="flex space-x-4 mt-2">
              <a
                href="#"
                className="hover:text-pink-500"
                aria-label="Facebook"
              >
                🌐 Facebook
              </a>
              <a
                href="#"
                className="hover:text-blue-400"
                aria-label="Instagram"
              >
                🌐 Instagram
              </a>
              <a
                href="#"
                className="hover:text-sky-500"
                aria-label="Twitter"
              >
                🌐 Twitter
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Salón de Belleza "La Puca". Todos los derechos reservados.
        </div>
      </footer>
    );
  }
  