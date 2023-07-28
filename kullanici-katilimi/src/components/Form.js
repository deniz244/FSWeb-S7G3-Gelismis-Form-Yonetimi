import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import axios from "axios";

const sema = Yup.object({
  name: Yup.string()
    .required("İsim-soyisim zorunludur.")
    .min(3, "İsim en az 3 karakter olmalı."),

  email: Yup.string()
    .required("Eposta adresi gerekli.")
    .email("Güvercin seni böyle bulamaz"),

  pass: Yup.string()
    .required("Şifre gerekli.")
    .min(7, "Şifre en az 7 karakter olmalı ve sadece sayı olmamalı")
    .matches(/[^0-9]/, "Şifre sadece sayı olamaz"),

  terms: Yup.boolean().oneOf([true], "Kabul etmek zorunlu"),
});

export default function Form() {
  const initialFormData = {
    name: "",
    email: "",
    pass: "",
    terms: false,
  };
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isDisabled, setIsDisabled] = useState(true);
  const [kullanicilar, setKullanicilar] = useState([]);

  useEffect(() => {
    setIsDisabled(true);
    //yup sema doğruysa
    sema.isValid(formData).then((valid) => {
      setIsDisabled(!valid);
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
        setIsDisabled(false);

        const newErrors = {
          ...errors,
          [e.target.name]: null,
        };
        setErrors(newErrors);
      })
      .catch((err) => {
        setIsDisabled(true);

        const newErrors = {
          ...errors,
          [e.target.name]: err.errors[0],
        };
        setErrors(newErrors);
      });

    setFormData(newFormData);
  }

  function submitHandler(e) {
    e.preventDefault();
    if (isDisabled) {
      console.log("formda hatalar var");
    } else {
      axios
        .post("https://reqres.in/api/users", formData)
        .then(function (response) {
          console.log("form gönderildi", response.data);
          console.log(response);

          setKullanicilar([...kullanicilar, response.data]);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  return (
    <div>
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="name">İsim ve Soyisim </label>
          <input
            data-testid="name"
            name="name"
            type="text"
            placeholder="isim-soyisim"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email">Eposta</label>
          <input
            data-testid="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="pass">Şifre</label>
          <input
            data-testid="pass"
            name="pass"
            type="password"
            value={formData.pass}
            onChange={handleChange}
          />
          {errors.pass && <p className="error">{errors.pass}</p>}
        </div>

        <div>
          <label htmlFor="terms">Kullanım Şartları</label>
          <input
            data-testid="terms"
            name="terms"
            type="checkbox"
            checked={formData.terms}
            onChange={handleChange}
          />
          {errors.terms && <p className="error">{errors.terms}</p>}
        </div>

        <button data-testid="submit" type="submit" disabled={isDisabled}>
          Gönder
        </button>
      </form>

      <ul>
        {kullanicilar.map((kullanici) => {
          return <li key={kullanici.id}>{kullanici.name}</li>;
        })}
      </ul>
    </div>
  );
}
