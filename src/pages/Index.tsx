
import TextToSpeechApp from "@/components/TextToSpeechApp";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-cyan-200 rounded-full opacity-20 animate-pulse delay-2000"></div>
      <div className="absolute bottom-40 right-10 w-28 h-28 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      
      {/* Contenido principal */}
      <div className="relative z-10">
        <TextToSpeechApp />
      </div>
    </div>
  );
};

export default Index;
