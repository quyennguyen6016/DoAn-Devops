--
-- PostgreSQL database dump
--


-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-05-08 17:48:12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 28678)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    customer_name character varying(100) NOT NULL,
    phone character varying(20),
    product_name character varying(150) NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    total_price numeric(10,2) NOT NULL,
    status character varying(30) DEFAULT 'pending'::character varying NOT NULL,
    note text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 219 (class 1259 OID 28677)
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5017 (class 0 OID 0)
-- Dependencies: 219
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- TOC entry 4856 (class 2604 OID 28681)
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- TOC entry 5011 (class 0 OID 28678)
-- Dependencies: 220
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, customer_name, phone, product_name, quantity, total_price, status, note, created_at, updated_at) FROM stdin;
1	Từ Nguyễn Huyền Trang	0901234567	Sách DevOps	2	200000.00	pending	Giao hàng nhanh	2026-05-08 01:24:38.494436	2026-05-08 01:24:38.494436
3	Nguyễn Ngọc Quyền	0912345678	Khóa học CI/CD	1	500000.00	completed	Đóng gói cẩn thận	2026-05-08 01:24:38.512767	2026-05-08 17:29:41.601163
4	Lê Hoàng Nam	0932123456	Linux Administration	3	450000.00	shipping	Khách VIP	2026-05-08 01:24:38.514627	2026-05-08 17:32:17.191031
6	Trương Minh Trung Huy	0795508242	Áo thun	2	1000000.00	pending	giao giờ tan ca	2026-05-08 01:57:23.646808	2026-05-08 17:32:21.511155
5	Phạm Thị Hương	0977888999	Kubernetes Guide	1	350000.00	processing	\N	2026-05-08 01:24:38.515964	2026-05-08 17:32:23.158366
2	Trương Thị Kim Ngân	0987654321	Docker Container	1	150000.00	cancelled	\N	2026-05-08 01:24:38.511196	2026-05-08 17:32:27.858633
9	Đỗ Quốc Đạt	0912345672	Áo phông	2	155000.00	pending	Khách quen	2026-05-08 17:43:48.230882	2026-05-08 17:43:48.230882
\.


--
-- TOC entry 5018 (class 0 OID 0)
-- Dependencies: 219
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 9, true);


--
-- TOC entry 4862 (class 2606 OID 28695)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


-- Completed on 2026-05-08 17:48:12

--
-- PostgreSQL database dump complete
--


