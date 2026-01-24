import { motion } from 'framer-motion';
import { producersData } from '../data/producers';
import ProducerCard from '../components/ProducerCard';
import SponsorsSection from '../components/SponsorsSection';
import LicensesSection from '../components/LicensesSection';
import ContactSection from '../components/ContactSection';

function ProducersPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent text-transparent bg-clip-text">
              Productores
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explora el catálogo de beats de nuestros productores destacados
          </p>
        </motion.div>

        {/* Producers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {producersData.map((producer, index) => (
            <motion.div
              key={producer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProducerCard producer={producer} />
            </motion.div>
          ))}
        </div>

        {/* Empty State if no producers */}
        {producersData.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-500 text-lg">
              No hay productores disponibles en este momento
            </p>
          </motion.div>
        )}
      </div>

      {/* Sponsors Section - Full Width */}
      <SponsorsSection />

      {/* Licenses Section */}
      <div className="max-w-7xl mx-auto px-4">
        <LicensesSection />
      </div>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-4">
        <ContactSection />
      </div>
    </div>
  );
}

export default ProducersPage;
