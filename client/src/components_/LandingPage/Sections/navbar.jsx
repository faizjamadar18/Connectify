
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";

import { Link } from "react-router-dom";
import {  useRef, useState } from "react";
import AnimationContainer from "../global/AnimateContainer";

import Wrapper from "../global/Wrapper";

const Navbar = () => {


  const ref = useRef(null);

  const [visible, setVisible] = useState(false);



  const { scrollY } = useScroll({
    target: ref ,
    offset: ["start start", "end start"],
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <header className="fixed w-full top-0 inset-x-0 z-50">
      {/* Desktop */}
      <motion.div
        animate={{
          width: visible ? "40%" : "100%",
          y: visible ? 20 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 40,
        }}
        style={{
          minWidth: "800px",
        }}
        className={cn(
          "hidden lg:flex bg-transparent self-start items-center justify-between py-4 rounded-full relative z-[50] mx-auto w-full backdrop-blur",
          visible && "bg-background/60 py-2 border border-t-foreground/20 border-b-foreground/10 border-x-foreground/15 w-full"
        )}
      >
        <Wrapper className="flex items-center justify-between lg:px-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex items-center gap-2 text-white">
              Home
            </Link>
          </motion.div>

          <div className="hidden lg:flex flex-row flex-1 absolute inset-0 items-center justify-center w-max mx-auto gap-x-2 text-sm text-muted-foreground font-medium">
            <AnimatePresence>
            
                <AnimationContainer
                 
                  animation="fadeDown"
                  delay={0.1 }
                >
                  <div className="relative">
                    <Link className="hover:text-foreground transition-all duration-500 hover:bg-accent rounded-md px-4 py-2">
                      name 
                    </Link>
                  </div>
                </AnimationContainer>
                <AnimationContainer
                 
                  animation="fadeDown"
                  delay={0.1}
                >
                  <div className="relative">
                    <Link className="hover:text-foreground transition-all duration-500 hover:bg-accent rounded-md px-4 py-2">
                      name 
                    </Link>
                  </div>
                </AnimationContainer>
                <AnimationContainer
                 
                  animation="fadeDown"
                  delay={0.1 }
                >
                  <div className="relative">
                    <Link className="hover:text-foreground transition-all duration-500 hover:bg-accent rounded-md px-4 py-2">
                      name 
                    </Link>
                  </div>
                </AnimationContainer>

            </AnimatePresence>
          </div>

          <AnimationContainer animation="fadeLeft" delay={0.1}>
            <div className="flex items-center gap-x-4">

                <Link href="/signup">
                  <Button size="sm">
                    Get started
                  </Button>
                </Link>

            </div>
          </AnimationContainer>
        </Wrapper>
      </motion.div>

      {/* Mobile */}
      <motion.div
        animate={{
          y: visible ? 20 : 0,
          borderTopLeftRadius: "2rem",
          borderTopRightRadius: "2rem",
          borderBottomLeftRadius: "2rem",
          borderBottomRightRadius:  "2rem",
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 50,
        }}
        className={cn(
          "flex relative flex-col lg:hidden w-full justify-between items-center mx-auto py-4 z-50",
          visible && "bg-neutral-950 w-11/12"
          
        )}
      >
        <Wrapper className="flex items-center justify-between lg:px-4">
          <div className="flex items-center justify-between gap-x-4 w-full text-white">
            <AnimationContainer animation="fadeRight" delay={0.1}>
              <Link href="/">
                home
              </Link>
            </AnimationContainer>

            <AnimationContainer animation="fadeLeft" delay={0.1}>
              <div className="flex items-center justify-center gap-x-4">
                <Button size="sm">
                  <Link href="/signup" className="flex items-center">
                    Get started
                  </Link>
                </Button>
              </div>
            </AnimationContainer>
          </div>
        </Wrapper>


      </motion.div>
    </header>
  );
};

export default Navbar;