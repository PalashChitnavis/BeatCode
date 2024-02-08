/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";

const FullScreenConfetti = () => {
        const [showConfetti, setShowConfetti] = useState(true);

        useEffect(() => {
                const timeout = setTimeout(() => {
                        setShowConfetti(false);
                }, 3000); // Stop confetti after 3 seconds

                return () => clearTimeout(timeout);
        }, []); // Run only once on mount

        return <>{showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}</>;
};

export default FullScreenConfetti;
