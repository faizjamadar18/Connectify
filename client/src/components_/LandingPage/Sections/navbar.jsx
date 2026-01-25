
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Link } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import AnimationContainer from "../global/AnimateContainer";
import Wrapper from "../global/Wrapper";
import { NAV_LINKS } from "../constants/nav-links";
import UserContext from "@/context/UserContext";
import { Avatar } from "@mui/material";
import { Dashboard } from "@mui/icons-material";


const Navbar = () => {


  const ref = useRef(null);

  const [visible, setVisible] = useState(false);

  const { loginUser } = useContext(UserContext)

  const { scrollY } = useScroll({
    target: ref,
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
            <Link href="/" className="flex items-center gap-1.5 text-white">
              <img className="h-10" src="/logo_chatapp.png" alt="" />
              <div className="text-lg font-semibold !leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500">
                Connectify
              </div>
            </Link>
          </motion.div>

          <div className="hidden lg:flex flex-row flex-1 absolute inset-0 items-center justify-center w-max mx-auto gap-x-2 text-sm text-muted-foreground font-medium">
            <AnimatePresence>
              {NAV_LINKS.map((link, index) => (
                <AnimationContainer
                  key={index}
                  animation="fadeDown"
                  delay={0.1 * index}
                >
                  <div className="relative">
                    <Link href={link.link} className="hover:text-white transition-all duration-500 rounded-md px-4 py-2">
                      {link.name}
                    </Link>
                  </div>
                </AnimationContainer>
              ))}
            </AnimatePresence>
          </div>

          <AnimationContainer animation="fadeLeft" delay={0.1}>
            <div className="flex items-center gap-x-4">


              {
                (loginUser) ? <Link to={`/u/chatting`} className='text-gray-300 hover:text-blue-400 transition'> <Button size="lg"><Dashboard ></Dashboard>Dashboard</Button>  </Link>
                  : <Link to='/login' className='text-gray-300 hover:text-blue-400 transition'><Button size="lg">Get Startted</Button> </Link>
              }



            </div>
          </AnimationContainer>
        </Wrapper>
      </motion.div>

      {/* Mobile */}
      <motion.div

        transition={{
          type: "spring",
          stiffness: 200,
          damping: 50,
        }}
        className={cn(
          "flex relative flex-col lg:hidden w-full justify-between items-center mx-auto py-4 z-50 bg-black/40"
        )}
      >
        <Wrapper className="flex items-center justify-between lg:px-4">
          <div className="flex items-center justify-between gap-x-4 w-full text-white">
            <AnimationContainer animation="fadeRight" delay={0.1}>
              <Link href="/" className="flex items-center gap-1.5 text-white">
                <img className="h-8" src="/logo_chatapp.png" alt="" />

              </Link>
            </AnimationContainer>

            <AnimationContainer animation="fadeLeft" delay={0.1}>
              <div className="flex items-center justify-center gap-x-4">
                <Button size="sm">
                  {
                    (loginUser) ? <Link to={`/u/chatting`} className='text-gray-300 hover:text-orange-400 transition'> <Dashboard className="mr-1"></Dashboard>Dashboard </Link>
                      : <Link to='/login' className='text-gray-300 hover:text-orange-400 transition'>Login</Link>
                  }
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