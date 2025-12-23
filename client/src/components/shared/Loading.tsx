import clsx from 'clsx';
import { motion } from 'framer-motion';
import { BookOpenCheck, Loader2 } from 'lucide-react';

const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      ease: 'linear',
      duration: 1,
    },
  },
};

const CourseLoading = ({containerClass}:any) => {
  return (
    <div className={clsx(" absolute top-0 left-0 flex w-full items-center justify-center h-full z-[2000] bg-slate-800/50 ",containerClass)}>
      <motion.div
        className="bg-white dark:bg-slate-950 shadow-2xl rounded-2xl p-10 flex flex-col items-center gap-4 border border-indigo-200 dark:border-slate-700"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.div
          className="p-4 bg-indigo-100 dark:bg-slate-800 rounded-full"
          variants={spinnerVariants}
          animate="animate"
        >
          <Loader2 className="w-10 h-10 text-indigo-600 dark:text-white" />
        </motion.div>
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-medium text-lg">
          <BookOpenCheck className="w-6 h-6" />
          <span>Adding Course...</span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">
          Please wait while we save your course data. This may take a few seconds.
        </p>
      </motion.div>
    </div>
  );
};

// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Lottie from "lottie-react";
import deleteAnimation from '../../assects/animations/delete.json';
export const DeleteLoading=({title,containerClass,iconClass}:{[key:string]:any})=>{

  return (
    <span className={clsx('absolute top-0 left-0 bg backdrop-blur-sm flex-col center w-full h-full z-[100]',containerClass)}>
        <Lottie animationData={deleteAnimation} loop={true}  size={30} className={clsx('size-[80px]  ',iconClass)}/>

        {title ?? "....Deleting content."}
    </span>
  
    //     <DotLottieReact
    //   src={deleteAnimation}
    //   className='size-20 text-slate-400 '
    //   loop
    //   autoplay
    // />
  )
}

export default CourseLoading;
