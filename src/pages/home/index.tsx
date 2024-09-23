import { useState, FormEvent, useEffect } from "react";
import styles from "./Home.module.css";
import { BsSearch } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";

export function Home() {
  return (
    <div>
      <h1>Bem-vindo ao Pagebox</h1>
      <p>Aqui você pode explorar seus arquivos e diretórios.</p>
    </div>
  );
}
