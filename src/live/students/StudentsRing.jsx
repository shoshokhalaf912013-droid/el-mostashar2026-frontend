import React from "react"
import StudentFrame from "./StudentFrame"
import { motion } from "framer-motion"

export default function StudentsRing({ participants }) {

  const students = participants.filter(
    (p) => p.identity !== "teacher"
  )

  const radius = 260
  const centerX = 300
  const centerY = 220

  if (students.length === 0) {
    return (
      <div className="students-ring">
        <div className="no-students">
          Waiting for students...
        </div>
      </div>
    )
  }

  return (

    <div
      className="students-ring"
      style={{
        position: "relative",
        width: "600px",
        height: "440px"
      }}
    >

      {students.map((p, index) => {

        const angle = (index / students.length) * (2 * Math.PI)

        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)

        return (

          <motion.div
            key={p.identity}
            className="student-circle"

            initial={{
              opacity: 0,
              scale: 0.5
            }}

            animate={{
              opacity: 1,
              scale: 1
            }}

            exit={{
              opacity: 0,
              scale: 0
            }}

            transition={{
              duration: 0.4
            }}

            style={{
              position: "absolute",
              left: `${x}px`,
              top: `${y}px`,
              transform: "translate(-50%, -50%)"
            }}
          >

            <StudentFrame participant={p} />

          </motion.div>

        )

      })}

    </div>

  )

}