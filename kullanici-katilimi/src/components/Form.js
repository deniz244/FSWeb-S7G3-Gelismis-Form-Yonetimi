import React, { useState, useEffect } from "react";
import * as Yup from "yup";

const initialState = {
  name: "deniz",
  email: "mail@mail.com",
  sifre: "123",
  kutu: true,
};

const sema = Yup.object().shape({
  name: Yup.string()
    .required("İsim-soyisim zorunludur.")
    .min(5, "İsim en az 5 karakter olmalı."),

  email: Yup.string()
    .required("Eposta adresi gerekli.")
    .matches(/[^0-9]/),

  sifre: Yup.string()
    .required("Şifre gerekli.")
    .min(7, "Şifre en az 7 karakter olmalı ve sadece sayı olmamalı")
    .matches(/[^0-9]/),

  kutu: Yup.boolean().oneOf([true], "Kabul etmek zorunlu"),
});

export default function Form() {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isFormValid, setFormValid] = useState(false);

  useEffect(() => {
    sema.isValid(formData).then((valid) => {
      setFormValid(valid);
    });
  }, [formData]);

  function handleChange(e) {
    //console.log(e.target.name);

    let value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    const newFormData = {
      ...formData,
      [e.target.name]: value,
    };

    Yup.reach(sema, e.target.name)
      .validate(value)
      .then((valid) => {
        setFormValid(true);
      })
      .catch((err) => {
        setErrors({
          ...errors,
          [e.target.name]: err.errors[0],
        });
      });

    setFormData(newFormData);
  }

  function submitHandler(e) {
    e.preventDefault();
  }

  return (
    <>
      <form onSubmit={submitHandler}>
        <br />
        <br />

        <label>
          <span>İsim</span>
          <input
            name="name"
            type="text"
            placeholder="isim-soyisim"
            value={formData.name}
            onChange={handleChange}
          ></input>
        </label>

        <br />
        <br />

        <label>
          <span>Email</span>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          ></input>
        </label>

        <br />
        <br />

        <label>
          <span>Şifre</span>
          <input
            name="sifre"
            type="password"
            value={formData.sifre}
            onChange={handleChange}
          ></input>
        </label>

        <br />
        <br />

        <label>
          <span>Kullanım Şartları</span>
          <input
            name="kutu"
            type="checkbox"
            checked={formData.kutu}
            onChange={handleChange}
          ></input>
        </label>
        <br />
        <br />
        <button type="submit" disabled={!isFormValid}>
          Gönder
        </button>
      </form>
    </>
  );
}
