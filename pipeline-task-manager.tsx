import React, { useState } from 'react';
import { PlusCircle, X, MoveHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const WaterDroplet = ({ size, delay, duration }) => (
  <div 
    className="absolute rounded-full bg-blue-200 opacity-30 animate-rise pointer-events-none"
    style={{
      width: size,
      height: size,
      animation: `rise ${duration}s linear ${delay}s infinite`,
      left: `${Math.random() * 100}%`,
    }}
  />
);

export default function TaskPipeline() {
  const [tasks, setTasks] = useState({
    job: [],
    'next review': [],
    declined: [],
    approved: []
  });
  const [newTask, setNewTask] = useState('');
  const [draggedTask, setDraggedTask] = useState(null);

  const addTask = (category) => {
    if (newTask.trim()) {
      setTasks(prev => ({
        ...prev,
        [category]: [...prev[category], newTask.trim()]
      }));
      setNewTask('');
    }
  };

  const removeTask = (category, index) => {
    setTasks(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };

  const handleDragStart = (category, index, task) => {
    setDraggedTask({ category, index, task });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetCategory) => {
    if (draggedTask && draggedTask.category !== targetCategory) {
      setTasks(prev => {
        const newTasks = { ...prev };
        newTasks[draggedTask.category] = newTasks[draggedTask.category].filter(
          (_, index) => index !== draggedTask.index
        );
        newTasks[targetCategory] = [...newTasks[targetCategory], draggedTask.task];
        return newTasks;
      });
    }
    setDraggedTask(null);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto bg-gradient-to-b from-blue-50 to-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">Task Pipeline</h2>
      
      <div className="flex gap-4 mb-6">
        <Input 
          type="text" 
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task"
          className="flex-grow text-lg py-6 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
        />
      </div>

      <div className="flex gap-6">
        {Object.keys(tasks).map(category => (
          <div 
            key={category} 
            className="flex-1 relative"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(category)}
          >
            <h3 className="text-xl font-semibold mb-3 capitalize text-blue-700">{category}</h3>
            <div className="relative min-h-[400px] overflow-hidden">
              {/* Water droplet effects */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <WaterDroplet 
                    key={i}
                    size={`${Math.random() * 20 + 10}px`}
                    delay={Math.random() * 2}
                    duration={Math.random() * 3 + 4}
                  />
                ))}
              </div>
              
              {/* Glass pipe effect */}
              <div className={`absolute inset-0 bg-blue-100 bg-opacity-10 rounded-xl 
                backdrop-blur-sm border-2 transition-all duration-300
                ${draggedTask && draggedTask.category !== category 
                  ? 'border-blue-400 border-dashed' 
                  : 'border-blue-200 border-opacity-50'}
                shadow-inner`} 
              />
              
              {/* Content */}
              <div className="relative z-10 p-4">
                {tasks[category].map((task, index) => (
                  <div 
                    key={index} 
                    className="bg-white bg-opacity-90 rounded-lg p-4 mb-3 shadow-md 
                      flex justify-between items-center cursor-move transform 
                      transition-all duration-200 hover:scale-102 hover:shadow-lg"
                    draggable
                    onDragStart={() => handleDragStart(category, index, task)}
                  >
                    <span className="text-gray-800">{task}</span>
                    <div className="flex items-center">
                      <MoveHorizontal size={16} className="mr-2 text-blue-400" />
                      <button 
                        onClick={() => removeTask(category, index)} 
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                <Button 
                  onClick={() => addTask(category)}
                  className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <PlusCircle className="mr-2" size={16} />
                  Add to {category}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes rise {
          0% {
            transform: translateY(100%) scale(1);
            opacity: 0.3;
          }
          100% {
            transform: translateY(-100%) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
