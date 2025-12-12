import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <a href="#" className="mb-4 inline-block">
              <img src="/lifextreme-logo.png" alt="Lifextreme" className="h-10 w-auto object-contain" />
            </a>
            <p className="text-gray-400 mb-6">Marketplace de turismo de aventura en Perú y Latinoamérica. Conectamos aventureros con experiencias únicas, equipos de calidad y guías certificados.</p>
            <div className="flex space-x-4">
              {['facebook-fill', 'instagram-line', 'twitter-x-line', 'youtube-line'].map((icon) => (
                <a key={icon} href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                  <i className={`ri-${icon}`}></i>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Explora</h4>
            <ul className="space-y-2">
              {['Tours de aventura', 'Tienda y alquiler', 'Guías certificados', 'Experiencias VR', 'Club Lifextreme'].map(item => (
                <li key={item}><a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Información</h4>
            <ul className="space-y-2">
              {['Sobre nosotros', 'Blog de aventuras', 'Eventos y cursos', 'Preguntas frecuentes', 'Contacto'].map(item => (
                <li key={item}><a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contáctanos</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="w-5 h-5 flex items-center justify-center text-gray-400 mr-2 mt-1">
                  <i className="ri-map-pin-line"></i>
                </div>
                <span className="text-gray-400">Calle Chiwampata 543 - San Blas</span>
              </li>
              <li className="flex items-start">
                <div className="w-5 h-5 flex items-center justify-center text-gray-400 mr-2 mt-1">
                  <i className="ri-phone-line"></i>
                </div>
                <span className="text-gray-400">+51 958050928</span>
              </li>
              <li className="flex items-start">
                <div className="w-5 h-5 flex items-center justify-center text-gray-400 mr-2 mt-1">
                  <i className="ri-mail-line"></i>
                </div>
                <span className="text-gray-400">lifextremeperu@gmail.com</span>
              </li>
            </ul>
            <h4 className="text-lg font-semibold mt-6 mb-4">Newsletter</h4>
            <div className="flex">
              <input type="email" placeholder="Tu correo electrónico" className="bg-gray-800 border-none text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm w-full" />
              <button className="bg-primary text-white px-4 py-2 rounded-r-lg whitespace-nowrap">Suscribirse</button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2025 Lifextreme. Todos los derechos reservados.</p>
            <div className="flex flex-wrap justify-center gap-4">
              {['Términos y condiciones', 'Política de privacidad', 'Política de cookies'].map(item => (
                <a key={item} href="#" className="text-gray-400 hover:text-white text-sm transition-colors">{item}</a>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {['visa-fill', 'mastercard-fill', 'paypal-fill', 'apple-fill'].map(icon => (
              <div key={icon} className="w-10 h-6 flex items-center justify-center bg-gray-800 rounded">
                <i className={`ri-${icon} text-xl`}></i>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;