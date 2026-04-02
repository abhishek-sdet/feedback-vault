"use client";

import { useState } from "react";
import Envelope from "./Envelope";
import LetterPaper from "./LetterPaper";
import GrievanceBox from "./GrievanceBox";
import TypewriterText from "./TypewriterText";
import { motion } from "framer-motion";

export default function LetterExperience() {
  const [step, setStep] = useState("closed");
  const [showBox, setShowBox] = useState(false);

  const handleSubmit = () => {
    setStep("folding");

    setTimeout(() => {
      setShowBox(true);
      setStep("posting");
    }, 1200);

    setTimeout(() => {
      setStep("done");
    }, 2500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">

      {step === "closed" && (
        <Envelope onOpen={() => setStep("message")} />
      )}

      {step === "message" && (
        <TypewriterText
          text="This letter is beyond trace. No identity, no record, no memory. Only truth remains."
          onComplete={() => setStep("writing")}
        />
      )}

      {step === "writing" && (
        <LetterPaper onSubmit={handleSubmit} />
      )}

      {step === "folding" && (
        <motion.div
          className="w-[200px] h-[150px] bg-[#f5e6c8]"
          animate={{ rotateX: 90, scale: 0.6 }}
          transition={{ duration: 1 }}
        />
      )}

      {step === "posting" && (
        <>
          <motion.div
            className="w-[100px] h-[60px] bg-[#f5e6c8]"
            initial={{ y: -100 }}
            animate={{ y: 80 }}
            transition={{ duration: 1 }}
          />
          <GrievanceBox show={showBox} />
        </>
      )}

      {step === "done" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600"
        >
          Your identity has been permanently erased.
        </motion.p>
      )}
    </div>
  );
}
