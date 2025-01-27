'use client';

import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';

const CitasForm = () => {
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const empleados = [
    { name: 'Gertrudis', formUrl: 'https://form.everestwebdeals.co/?form=d56ad2a5a6186de48e4aefc0e2a85072' },
    { name: 'Juana', formUrl: 'https://form.everestwebdeals.co/?form=3e530f2860e4dbdaf65714a39ead384d' },
    { name: 'Ana', formUrl: 'https://form.everestwebdeals.co/?form=570dda775d1fd14bfdc28d3d42631b58' },
    { name: 'Josefina', formUrl: 'https://form.everestwebdeals.co/?form=b05efe8f20bbba525bee184c599547a1' },
    { name: 'Antonia', formUrl: 'https://form.everestwebdeals.co/?form=598eb57ff1e25910f58e80122ea11e6b' },
  ];

  const handleOpenModal = (formUrl: string) => {
    setSelectedForm(formUrl);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedForm(null);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 flex flex-col items-center gap-8">
      <h1 className="text-3xl font-bold text-center mb-4">
        Agenda tu cita de forma eficaz con nosotros
      </h1>
      <p className="text-lg text-gray-600 text-center mb-6">
        Selecciona con quién te vas a atender
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        {empleados.map((empleado) => (
          <motion.button
            key={empleado.name}
            onClick={() => handleOpenModal(empleado.formUrl)}
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {empleado.name}
          </motion.button>
        ))}
      </div>

      {/* Modal */}
      <Transition show={isModalOpen} as={motion.div} className="relative z-10">
        <Dialog as="div" className="fixed inset-0 overflow-y-auto" onClose={handleCloseModal}>
          <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-50 p-4">
            <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                Agenda tu cita
              </Dialog.Title>
              <div className="mt-4">
                {selectedForm && (
                  <iframe
                    src={selectedForm}
                    className="w-full h-[500px] border rounded-lg"
                    title="Formulario de Cita"
                  />
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-md"
                  onClick={handleCloseModal}
                >
                  Cerrar
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default CitasForm;
