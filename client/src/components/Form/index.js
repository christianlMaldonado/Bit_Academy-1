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

export function DropDown(props) {
  return <select {...props}>{props.children}</select>;
}

export function Choices(props) {
  return <option {...props}>{props.children}</option>;
}

export function Btn(props) {
  return <button {...props}>{props.children}</button>;
}
