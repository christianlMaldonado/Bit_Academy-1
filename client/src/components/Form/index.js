import React from "react";

export function Form(props) {
  return <form {...props}>{props.children}</form>;
}

export function Input(props) {
  return <input {...props} />;
}

export function Text(props) {
  return <textarea {...props}></textarea>;
}

export function Btn(props) {
  return <button {...props}>{props.children}</button>;
}
