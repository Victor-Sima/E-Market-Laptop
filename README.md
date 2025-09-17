# Laptop Market API - Ghid pentru Postman

Acest proiect este o aplicație NestJS pentru gestionarea unui market de laptopuri, cu funcții CRUD adăugate pentru interacțiune cu Postman.

## Pornirea Serverului

Serverul rulează pe portul 3000. Pentru a-l porni în mod dezvoltare:

```bash
npm run start:dev
```

Serverul va fi disponibil la `http://localhost:3000`.

## Configurare Generală în Postman

- Deschide Postman și creează o nouă cerere (New Request).
- Setează URL-ul de bază: `http://localhost:3000`.
- Pentru cereri cu body (POST, PUT), selectează tab-ul "Body", alege "raw" și "JSON" pentru a trimite date JSON.

## Endpoint-uri pentru Produse (Products) - fără autentificare necesară

### GET /products/list
- **Metodă:** GET
- **URL:** `http://localhost:3000/products/list`
- **Descriere:** Listează toate laptopurile.

### POST /products
- **Metodă:** POST
- **URL:** `http://localhost:3000/products`
- **Body (JSON):**
  ```json
  {
    "name": "Laptop Nou",
    "brand": "BrandX",
    "processor": "Intel i7",
    "ram": "16GB",
    "storage": "512GB SSD",
    "graphics": "NVIDIA GTX 1650",
    "screen": "15.6 inch",
    "price": 2500,
    "stock": 10,
    "image": "image.jpg",
    "description": "Descriere laptop",
    "category": "gaming",
    "isAvailable": true
  }
  ```
- **Descriere:** Creează un laptop nou. Răspuns: Laptop creat cu ID nou.

### PUT /products/:id
- **Metodă:** PUT
- **URL:** `http://localhost:3000/products/1` (înlocuiește :id cu un ID real, ex. 1)
- **Body (JSON):** Doar câmpurile de actualizat, ex.:
  ```json
  {
    "price": 2600,
    "stock": 5
  }
  ```
- **Descriere:** Actualizează un laptop. Răspuns: Laptop actualizat.

### DELETE /products/:id
- **Metodă:** DELETE
- **URL:** `http://localhost:3000/products/1`
- **Descriere:** Șterge un laptop. Răspuns: Confirmare ștergere.

## Endpoint-uri pentru Utilizatori (Users) - necesită roluri (admin pentru POST/PUT/DELETE)

### GET /users/list
- **Metodă:** GET
- **URL:** `http://localhost:3000/users/list`
- **Descriere:** Listează utilizatori (doar admin).

### POST /users
- **Metodă:** POST
- **URL:** `http://localhost:3000/users`
- **Body (JSON):**
  ```json
  {
    "username": "user_nou",
    "email": "user@example.com",
    "role": "user",
    "isActive": true
  }
  ```
- **Descriere:** Creează utilizator nou (doar admin). Răspuns: Utilizator creat.

### PUT /users/:id
- **Metodă:** PUT
- **URL:** `http://localhost:3000/users/1`
- **Body:** Câmpuri de actualizat, ex. `{"email": "nou@email.com"}`
- **Descriere:** Actualizează utilizator (doar admin).

### DELETE /users/:id
- **Metodă:** DELETE
- **URL:** `http://localhost:3000/users/1`
- **Descriere:** Șterge utilizator (doar admin).

## Endpoint-uri pentru Admin (Admin) - necesită rol admin

### POST /admin
- **Metodă:** POST
- **URL:** `http://localhost:3000/admin`
- **Body:** Același ca la POST /products.
- **Descriere:** Creează laptop (similar cu POST /products, dar pentru admin).

### PUT /admin/:id
- **Metodă:** PUT
- **URL:** `http://localhost:3000/admin/1`
- **Body:** Câmpuri de actualizat.
- **Descriere:** Actualizează laptop complet.

### DELETE /admin/:id
- **Metodă:** DELETE
- **URL:** `http://localhost:3000/admin/1`
- **Descriere:** Șterge laptop.

## Note Importante

- Pentru endpoint-urile cu roluri (users și admin), dacă nu ai autentificare setată, vei primi eroare 403. Poți testa GET-urile publice mai întâi.
- Verifică răspunsurile în tab-ul "Response" din Postman (ar trebui să fie JSON cu "success": true).
- Dacă primești erori (ex. ID invalid), încearcă cu ID-uri existente (folosește GET pentru a vedea datele).
- Pentru a testa autentificarea, adaugă header-ul Authorization dacă e implementat (nu în acest proiect de bază).

## Schimbări Adăugate

- Funcții CRUD adăugate în servicii și controlere pentru produse, utilizatori și admin.
- Server pornit și rute mapate fără erori.
- Datele sunt stocate în memorie (array-uri statice), deci se resetează la repornirea serverului.
