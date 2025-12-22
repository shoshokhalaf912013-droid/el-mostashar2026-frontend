// src/pages/AdminStudents.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Box, Typography, Paper, Button, Grid } from "@mui/material";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchUsers();
  }, []);

  const makeAdmin = async (id) => {
    await updateDoc(doc(db, "users", id), { role: "admin" });
    alert("تم الترقية لأدمن");
  };

  const renew = async (id) => {
    const expiration = new Date(Date.now() + 30*24*60*60*1000);
    await updateDoc(doc(db, "users", id), { subscriptionStatus: "active", subscriptionEnd: expiration });
    alert("تم تجديد الاشتراك شهرياً");
  };

  return (
    <Box p={3}>
      <Typography variant="h5" color="warning.main" mb={2}>🧑‍🎓 إدارة الطلاب</Typography>

      <Grid container spacing={2}>
        {students.map(s => (
          <Grid key={s.id} item xs={12} md={6}>
            <Paper sx={{p:2}} elevation={2}>
              <Typography>{s.fullName} — {s.email}</Typography>
              <Typography variant="caption">الحالة: {s.subscriptionStatus || "غير محددة"}</Typography>
              <Box mt={1} sx={{display:"flex", gap:1}}>
                <Button size="small" variant="contained" onClick={() => makeAdmin(s.id)}>اجعله أدمن</Button>
                <Button size="small" variant="outlined" onClick={() => renew(s.id)}>تجديد يدوي</Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
