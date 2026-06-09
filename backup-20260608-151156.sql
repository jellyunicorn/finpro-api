--
-- PostgreSQL database dump
--

\restrict OpWdtml8AqmRgI5gZfphS14lhI216qIxxYuCJJ0fVuvH2EGqMS5iZlxNCchI5qD

-- Dumped from database version 18.3 (Debian 18.3-1.pgdg13+1)
-- Dumped by pg_dump version 18.3 (Homebrew)

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

--
-- Name: ComplaintStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ComplaintStatus" AS ENUM (
    'PENDING',
    'RESOLVED',
    'EXPIRED'
);


ALTER TYPE public."ComplaintStatus" OWNER TO postgres;

--
-- Name: ComplaintType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ComplaintType" AS ENUM (
    'DAMAGED_CLOTHING',
    'DIRTY_CLOTHING',
    'TOOK_TOO_LONG',
    'DRIVER_WAS_RUDE',
    'OTHER'
);


ALTER TYPE public."ComplaintType" OWNER TO postgres;

--
-- Name: DeliveryStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DeliveryStatus" AS ENUM (
    'PENDING',
    'WAITING_FOR_DRIVER',
    'OTW_TO_OUTLET',
    'OTW_TO_CUSTOMER',
    'ARRIVED_AT_CUSTOMER',
    'CANCELLED'
);


ALTER TYPE public."DeliveryStatus" OWNER TO postgres;

--
-- Name: EmployeeType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EmployeeType" AS ENUM (
    'WORKER',
    'DRIVER',
    'ADMIN'
);


ALTER TYPE public."EmployeeType" OWNER TO postgres;

--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'WAITING_FOR_DRIVER',
    'OTW_TO_OUTLET',
    'ARRIVED_AT_OUTLET',
    'WASHING',
    'IRONING',
    'PACKING',
    'WAITING_FOR_PAYMENT',
    'READY_TO_DELIVER',
    'OTW_TO_CUSTOMER',
    'ARRIVED_AT_CUSTOMER',
    'CANCELLED'
);


ALTER TYPE public."OrderStatus" OWNER TO postgres;

--
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'VISA',
    'MASTERCARD',
    'GOPAY',
    'DANA',
    'XENDIT',
    'BCA_VIRTUAL_ACCOUNT',
    'CARDS'
);


ALTER TYPE public."PaymentMethod" OWNER TO postgres;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'SUCCESS',
    'FAILED',
    'CANCELLED',
    'REFUNDED'
);


ALTER TYPE public."PaymentStatus" OWNER TO postgres;

--
-- Name: PickupStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PickupStatus" AS ENUM (
    'PENDING',
    'WAITING_FOR_DRIVER',
    'OTW_TO_CUSTOMER',
    'OTW_TO_OUTLET',
    'ARRIVED_AT_OUTLET',
    'CANCELLED'
);


ALTER TYPE public."PickupStatus" OWNER TO postgres;

--
-- Name: Provider; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Provider" AS ENUM (
    'GOOGLE',
    'APPLE',
    'CREDENTIALS'
);


ALTER TYPE public."Provider" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'ADMIN',
    'DRIVER',
    'WORKER',
    'SUPERADMIN'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- Name: Station; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Station" AS ENUM (
    'WASHING',
    'IRONING',
    'PACKING'
);


ALTER TYPE public."Station" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: attendances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attendances (
    id integer NOT NULL,
    start_time timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    end_time timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone,
    employee_id integer NOT NULL
);


ALTER TABLE public.attendances OWNER TO postgres;

--
-- Name: attendances_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attendances_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attendances_id_seq OWNER TO postgres;

--
-- Name: attendances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attendances_id_seq OWNED BY public.attendances.id;


--
-- Name: complaints; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.complaints (
    id integer NOT NULL,
    ticket_number integer NOT NULL,
    complaint_type public."ComplaintType" NOT NULL,
    body text NOT NULL,
    attachment text,
    admin_response text,
    "respondedBy" text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    customer_id integer NOT NULL,
    order_id integer NOT NULL
);


ALTER TABLE public.complaints OWNER TO postgres;

--
-- Name: complaints_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.complaints_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.complaints_id_seq OWNER TO postgres;

--
-- Name: complaints_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.complaints_id_seq OWNED BY public.complaints.id;


--
-- Name: districts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.districts (
    code text NOT NULL,
    name text NOT NULL,
    regency_code text NOT NULL
);


ALTER TABLE public.districts OWNER TO postgres;

--
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    id integer NOT NULL,
    type public."EmployeeType" NOT NULL,
    salary integer,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone,
    user_id integer NOT NULL,
    outlet_id integer NOT NULL
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- Name: employees_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employees_id_seq OWNER TO postgres;

--
-- Name: employees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employees_id_seq OWNED BY public.employees.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: order_deliveries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_deliveries (
    id integer NOT NULL,
    status public."DeliveryStatus" DEFAULT 'WAITING_FOR_DRIVER'::public."DeliveryStatus" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone,
    driver_id integer,
    delivery_id text NOT NULL,
    order_id integer NOT NULL
);


ALTER TABLE public.order_deliveries OWNER TO postgres;

--
-- Name: order_deliveries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_deliveries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_deliveries_id_seq OWNER TO postgres;

--
-- Name: order_deliveries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_deliveries_id_seq OWNED BY public.order_deliveries.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    name text NOT NULL,
    quantity integer NOT NULL,
    price integer NOT NULL,
    description text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone,
    order_id integer NOT NULL,
    weight double precision DEFAULT 0 NOT NULL
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: order_jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_jobs (
    id integer NOT NULL,
    is_bypassed boolean DEFAULT false NOT NULL,
    bypass_approved boolean,
    "bypassedBy" text,
    station public."Station" NOT NULL,
    start_time timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    end_time timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone,
    employee_id integer,
    outlet_id integer NOT NULL,
    order_id integer NOT NULL,
    job_id text NOT NULL
);


ALTER TABLE public.order_jobs OWNER TO postgres;

--
-- Name: order_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_jobs_id_seq OWNER TO postgres;

--
-- Name: order_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_jobs_id_seq OWNED BY public.order_jobs.id;


--
-- Name: order_pickups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_pickups (
    id integer NOT NULL,
    status public."PickupStatus" DEFAULT 'WAITING_FOR_DRIVER'::public."PickupStatus" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone,
    driver_id integer,
    pickup_id text NOT NULL,
    order_id integer
);


ALTER TABLE public.order_pickups OWNER TO postgres;

--
-- Name: order_pickups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_pickups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_pickups_id_seq OWNER TO postgres;

--
-- Name: order_pickups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_pickups_id_seq OWNED BY public.order_pickups.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    scheduled_time timestamp(3) without time zone NOT NULL,
    pickup_time timestamp(3) without time zone,
    order_status public."OrderStatus" NOT NULL,
    delivery_cost integer NOT NULL,
    payment_status public."PaymentStatus" NOT NULL,
    payment_method public."PaymentMethod",
    payment_time timestamp(3) without time zone,
    distance numeric(65,30) NOT NULL,
    confirmed_at timestamp(3) without time zone,
    delivered_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone,
    user_id integer NOT NULL,
    outlet_id integer NOT NULL,
    order_id text NOT NULL,
    address_id integer,
    xendit_session_id text
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: outlets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.outlets (
    id integer NOT NULL,
    name text NOT NULL,
    address text NOT NULL,
    city text NOT NULL,
    postal_code text NOT NULL,
    latitude numeric(65,30) NOT NULL,
    longitude numeric(65,30) NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.outlets OWNER TO postgres;

--
-- Name: outlets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.outlets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.outlets_id_seq OWNER TO postgres;

--
-- Name: outlets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.outlets_id_seq OWNED BY public.outlets.id;


--
-- Name: provinces; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.provinces (
    code text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.provinces OWNER TO postgres;

--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    id integer NOT NULL,
    token text NOT NULL,
    "expiredAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" integer NOT NULL
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.refresh_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.refresh_tokens_id_seq OWNER TO postgres;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;


--
-- Name: regencies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.regencies (
    code text NOT NULL,
    name text NOT NULL,
    province_code text NOT NULL
);


ALTER TABLE public.regencies OWNER TO postgres;

--
-- Name: user_addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_addresses (
    id integer NOT NULL,
    address text NOT NULL,
    city text NOT NULL,
    postal_code text NOT NULL,
    latitude numeric(65,30) NOT NULL,
    longitude numeric(65,30) NOT NULL,
    is_primary boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone,
    user_id integer NOT NULL,
    label text NOT NULL,
    district_code text,
    regency_code text,
    village_code text
);


ALTER TABLE public.user_addresses OWNER TO postgres;

--
-- Name: user_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_addresses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_addresses_id_seq OWNER TO postgres;

--
-- Name: user_addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_addresses_id_seq OWNED BY public.user_addresses.id;


--
-- Name: user_notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_notifications (
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp(3) without time zone,
    notification_id integer NOT NULL,
    read_at timestamp(3) without time zone,
    user_id integer NOT NULL
);


ALTER TABLE public.user_notifications OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    password text,
    birth_date timestamp(3) without time zone,
    phone text,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    avatar text,
    full_name text NOT NULL,
    provider public."Provider" DEFAULT 'CREDENTIALS'::public."Provider" NOT NULL,
    verified_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: villages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.villages (
    code text NOT NULL,
    name text NOT NULL,
    district_code text NOT NULL
);


ALTER TABLE public.villages OWNER TO postgres;

--
-- Name: attendances id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendances ALTER COLUMN id SET DEFAULT nextval('public.attendances_id_seq'::regclass);


--
-- Name: complaints id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complaints ALTER COLUMN id SET DEFAULT nextval('public.complaints_id_seq'::regclass);


--
-- Name: employees id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees ALTER COLUMN id SET DEFAULT nextval('public.employees_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: order_deliveries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_deliveries ALTER COLUMN id SET DEFAULT nextval('public.order_deliveries_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: order_jobs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_jobs ALTER COLUMN id SET DEFAULT nextval('public.order_jobs_id_seq'::regclass);


--
-- Name: order_pickups id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_pickups ALTER COLUMN id SET DEFAULT nextval('public.order_pickups_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: outlets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.outlets ALTER COLUMN id SET DEFAULT nextval('public.outlets_id_seq'::regclass);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);


--
-- Name: user_addresses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_addresses ALTER COLUMN id SET DEFAULT nextval('public.user_addresses_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
eab5f44d-40de-4185-ba46-64e0d2b3d4bf	979e5418fb6bcbb536b2500a45ec5cdf080f17faac5dcc331d68d704efae78e8	2026-05-19 01:23:55.964517+00	20251210165053_initial	\N	\N	2026-05-19 01:23:55.955614+00	1
0a084caa-cf41-4e92-b1a2-9d380218a760	920eff7051c35186d92545d2e758cae0f44985d6c0b3e40a27e9c9e82185ecde	2026-05-19 01:24:09.368733+00	20260519012409_user_table_role_enums_and_provider_enum	\N	\N	2026-05-19 01:24:09.334134+00	1
06c1b9d8-68d4-489c-84b5-5ceb4b6daba2	bc64fc069e9501f8537e0ff575987f7b1855b40ba548691d40f7c4d4b18e5e48	2026-05-21 05:52:28.245425+00	20260519045931_initial_schema	\N	\N	2026-05-21 05:52:27.99057+00	1
768de13a-5ec6-42fc-b422-ebb5c955ed83	c21a22a524b9733733af73889b91a0575b50f89bcdbfaccb9f4ee3aeb8419fce	2026-05-21 05:52:32.026891+00	20260521055231_add_refresh_token_table	\N	\N	2026-05-21 05:52:32.002546+00	1
9395b6d2-9d29-48bd-a309-3962930d424f	ba219cb1323fb1d77beafe1a84126e0e158869e23e322dac57451beb4eeb626d	2026-05-26 13:26:05.209013+00	20260526132605_add_label_column_for_user_addresses	\N	\N	2026-05-26 13:26:05.194584+00	1
0fe90498-3aa1-43ba-9b15-687be1fa9e34	34436052aa1d17999bbb02127fe8286ecc239bd10651e063baf9e1185114f66c	2026-05-29 09:51:37.427621+00	20260527164514_make_end_time_in_attendance_table_nullable	\N	\N	2026-05-29 09:51:37.417068+00	1
ca4bd06c-b3a8-43c3-b25f-f4b93bae952d	d437f298bd53bf9918cc61893cba2e7b237350211f2c865c5a302e8b8767c7d0	2026-05-29 09:51:37.468965+00	20260528050538_add_admin_constant_to_employee_type_enum	\N	\N	2026-05-29 09:51:37.45017+00	1
d69e27dc-acca-45d8-bf87-d19ad3dc38da	e44e1406d742bfa740ff474a52a092d35180b40838e9891d074ef6fcb56eb736	2026-05-29 09:52:11.379009+00	20260529095211_make_paymenttime_method_pickup_time_confirmed_at_and_delivered_at_optional	\N	\N	2026-05-29 09:52:11.373628+00	1
453b1f80-e680-4056-a8fc-18ddd0c3904f	4ae6586dbcec1b7204e9a3ea216a66fd4b702c1396ac727852d0328bb4624e5f	2026-05-31 03:12:50.274838+00	20260531031250_add_order_id_for_user_reference	\N	\N	2026-05-31 03:12:50.242246+00	1
51c27162-75b2-43b1-9de1-7686f438a970	b432b620dc42d9a921a47b8fed4ed83f9c3ff7416b3be36c769e03626422aee4	\N	20260607042326_add_default_now_on_start_time_column_in_job_table	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20260607042326_add_default_now_on_start_time_column_in_job_table\n\nDatabase error code: 23502\n\nDatabase error:\nERROR: column "order_id" of relation "order_pickups" contains null values\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E23502), message: "column \\"order_id\\" of relation \\"order_pickups\\" contains null values", detail: None, hint: None, position: None, where_: None, schema: Some("public"), table: Some("order_pickups"), column: Some("order_id"), datatype: None, constraint: None, file: Some("tablecmds.c"), line: Some(6456), routine: Some("ATRewriteTable") }\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name="20260607042326_add_default_now_on_start_time_column_in_job_table"\n             at schema-engine/connectors/sql-schema-connector/src/apply_migration.rs:113\n   1: schema_commands::commands::apply_migrations::Applying migration\n           with migration_name="20260607042326_add_default_now_on_start_time_column_in_job_table"\n             at schema-engine/commands/src/commands/apply_migrations.rs:95\n   2: schema_core::state::ApplyMigrations\n             at schema-engine/core/src/state.rs:255	\N	2026-06-08 05:55:04.129666+00	0
3a571499-d52a-4ec1-a986-790763a080a2	c8a8cb88ba057c0a89e4b8811010ad7c75ece8ee182cc52a8139b0bd6237744e	2026-06-03 10:08:43.896402+00	20260603100843_added_xendit_session_id_for_idempotency_check	\N	\N	2026-06-03 10:08:43.873534+00	1
d5f8a219-d346-4f73-bda6-57e356422f8c	c07994371e5f5115b5fd9e35c0fb9b0834814434002e71bbeca317236a6da9fd	2026-06-02 08:36:37.671712+00	20260602083009_added_address_id_to_order_table_for_workers_to_know_where_to_send_to		\N	2026-06-02 08:36:37.671712+00	0
9116dbae-b9b5-4218-b171-61ad6de72736	a9610b722a0e630baf75419ee0f1db5c937f62e792e26007fb85f1a73148c910	2026-06-03 04:01:21.554546+00	20260603040121_add_weight_to_ordersitem_table	\N	\N	2026-06-03 04:01:21.513725+00	1
74b43df9-efeb-4194-acbd-f1ba0a946d15	7c19e1665a781a3af50bc1ee1ef30e306dd0beaf5b6fe4faa0909a4d8b5f664c	2026-06-03 05:04:47.918602+00	20260603050447_change_weight_to_float	\N	\N	2026-06-03 05:04:47.894734+00	1
b3a60b2b-13ab-4fae-98e9-fac13a601d16	db4e8c95835f6253a81069a72a549402a479e6df8b074b4583da4d180026599d	2026-06-03 12:31:19.700889+00	20260603123119_add_bca_virtual_account_as_method	\N	\N	2026-06-03 12:31:19.693929+00	1
1c5ce222-8954-47e7-8f7d-8c5d1facd92b	8e5e351e7c68c2c897fdf31944dae3f3f280b25f4336d6747eaef686bb63e3e6	2026-06-03 10:08:12.366199+00	20260603080506_add_user_notification_join_table	\N	\N	2026-06-03 10:08:12.351525+00	1
6baaf841-3951-47c4-be74-8221a7e01fe8	d2901bfa6b20af3def2d809cdb66db21705e3323629d10f4319bbb5c8507e82f	2026-06-05 02:47:17.152572+00	20260603170604_add_created_at_column_at_user_notifications_table	\N	\N	2026-06-05 02:47:17.126228+00	1
ee9d23a6-d721-4ecf-a3ca-fa0a100191ff	2b03d734d5ec2e6db3005894a922f615ec10139d7e6cb4cf3b6bc5d4bbc59178	2026-06-05 02:47:17.209133+00	20260603173003_make_driver_nullable_in_pickup_and_delivery_tables	\N	\N	2026-06-05 02:47:17.153652+00	1
37ba0116-6b69-4f23-9d9a-a35b9a058dc2	6925ae63e33ee2d68a0f23a920d142380a5ad3e70b473ad1be036ae99f4cf2a0	2026-06-05 02:47:17.22677+00	20260603173247_add_default_status_for_pickup_delivery_tables	\N	\N	2026-06-05 02:47:17.215511+00	1
17f1684d-034f-4fbf-8b36-6ca6d297bff3	566b6287d2d828473433aed06f5330726fe68c2bcc8569abb02380a538b9f47e	2026-06-05 04:34:31.402763+00	20260605043431_added_payment_method_enums	\N	\N	2026-06-05 04:34:31.395421+00	1
a05aacf9-d08a-48b1-bf0e-ea4aee225ec2	1b52c0768926a2fd34db1c60e6befb5c1ebe6350cf55fa390af746187ce7c2a7	2026-06-05 08:59:36.374624+00	20260605085936_add_provinces_regencies_villages_and_district_to_the_schema	\N	\N	2026-06-05 08:59:36.323074+00	1
aadd062f-8c2c-4f38-b9a5-ccd983a760f1	667e22e2459153728b47687da04cd2af263c45af228e7ef3c9481d75390c69bc	2026-06-06 03:39:32.5488+00	20260606033932_add_new_regency_district_and_village_fk_to_user_address	\N	\N	2026-06-06 03:39:32.526532+00	1
8354254f-d54d-44bb-942a-4de11fddca2c	cb3aaf6ac31522c341973b2a300dd5f93ffaa4b6673d262d7f0ab3d29b71bcb1	2026-06-08 05:55:04.122309+00	20260606112037_add_order_relation_to_job_pickup_delivery_tables	\N	\N	2026-06-08 05:55:04.101651+00	1
0d3e425a-c1d9-4524-962f-18667da4e17f	0d91532616ae26b385b5f6cab09d68986cdc8380f0d2eb72e652f8da929a760d	2026-06-08 05:55:04.128847+00	20260606132828_make_employee_nullable_in_job_table	\N	\N	2026-06-08 05:55:04.123034+00	1
\.


--
-- Data for Name: attendances; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attendances (id, start_time, end_time, created_at, updated_at, deleted_at, employee_id) FROM stdin;
\.


--
-- Data for Name: complaints; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.complaints (id, ticket_number, complaint_type, body, attachment, admin_response, "respondedBy", created_at, customer_id, order_id) FROM stdin;
\.


--
-- Data for Name: districts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.districts (code, name, regency_code) FROM stdin;
31.01.01	Kepulauan Seribu Utara	31.01
31.01.02	Kepulauan Seribu Selatan	31.01
31.71.01	Gambir	31.71
31.71.02	Sawah Besar	31.71
31.71.03	Kemayoran	31.71
31.71.04	Senen	31.71
31.71.05	Cempaka Putih	31.71
31.71.06	Menteng	31.71
31.71.07	Tanah Abang	31.71
31.71.08	Johar Baru	31.71
31.72.01	Penjaringan	31.72
31.72.02	Tanjung Priok	31.72
31.72.03	Koja	31.72
31.72.04	Cilincing	31.72
31.72.05	Pademangan	31.72
31.72.06	Kelapa Gading	31.72
31.73.01	Cengkareng	31.73
31.73.02	Grogol Petamburan	31.73
31.73.03	Taman Sari	31.73
31.73.04	Tambora	31.73
31.73.05	Kebon Jeruk	31.73
31.73.06	Kalideres	31.73
31.73.07	Pal Merah	31.73
31.73.08	Kembangan	31.73
31.74.01	Tebet	31.74
31.74.02	Setiabudi	31.74
31.74.03	Mampang Prapatan	31.74
31.74.04	Pasar Minggu	31.74
31.74.05	Kebayoran Lama	31.74
31.74.06	Cilandak	31.74
31.74.07	Kebayoran Baru	31.74
31.74.08	Pancoran	31.74
31.74.09	Jagakarsa	31.74
31.74.10	Pesanggrahan	31.74
31.75.01	Matraman	31.75
31.75.02	Pulogadung	31.75
31.75.03	Jatinegara	31.75
31.75.04	Kramatjati	31.75
31.75.05	Pasar Rebo	31.75
31.75.06	Cakung	31.75
31.75.07	Duren Sawit	31.75
31.75.08	Makasar	31.75
31.75.09	Ciracas	31.75
31.75.10	Cipayung	31.75
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employees (id, type, salary, created_at, updated_at, deleted_at, user_id, outlet_id) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, title, body, created_at) FROM stdin;
1	New Order Created	Order #cmpyt70hj0000mgughy33o1ez ready for pickup	2026-06-04 01:20:54.599
2	New Order Created	Order #cmpytckci0001mgug1fqaef1t ready for pickup	2026-06-04 01:25:13.61
3	New Order Created	Order #cmpytffsu0002mgugt1kyne2l ready for pickup	2026-06-04 01:27:27.687
4	New Order Created	Order #cmpytjvd4000088ug175zzixg ready for pickup	2026-06-04 01:30:54.488
5	New Order Created	Order #cmpz3nurg0000cgug4xt4a17g ready for pickup	2026-06-04 06:13:56.51
6	New Order Created	Order #cmpzbbdsp0000qgug7hdfnwuq ready for pickup	2026-06-04 09:48:11.567
7	New Order Created	Order #cmpzc9gdl0001qgugmtilnvq4 ready for pickup	2026-06-04 10:14:41.208
8	New Order Created	Order #e9f4f844-297e-4b19-99f6-b01398389ee1 ready for pickup	2026-06-05 03:33:24.631
9	New Order Created	Order #6409398c-a9f6-408e-bbf2-c99bf740792e ready for pickup	2026-06-05 07:31:14.363
10	New Order Created	Order #e2adeedd-0b71-47e2-a163-96784302e642 ready for pickup	2026-06-06 08:07:21.404
\.


--
-- Data for Name: order_deliveries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_deliveries (id, status, created_at, updated_at, deleted_at, driver_id, delivery_id, order_id) FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, name, quantity, price, description, created_at, updated_at, deleted_at, order_id, weight) FROM stdin;
1	Kemeja Lengan Panjang	3	15000	Cuci + setrika	2026-06-03 02:58:41.783	2026-06-03 02:58:41.783	\N	24	1
2	Celana Jeans	2	12000	Cuci kering	2026-06-03 02:58:41.783	2026-06-03 02:58:41.783	\N	24	1
3	Kaos Polos	5	8000	Cuci + setrika	2026-06-03 02:58:41.783	2026-06-03 02:58:41.783	\N	24	2
4	Jaket Hoodie	1	25000	Cuci kering + dry clean	2026-06-03 02:58:41.783	2026-06-03 02:58:41.783	\N	24	1
5	Sprei Single	1	30000	Cuci + setrika premium	2026-06-03 02:58:41.783	2026-06-03 02:58:41.783	\N	24	3
6	Kemeja Lengan Panjang	2	15000	Cuci + setrika	2026-06-03 05:03:08.81	2026-06-03 05:03:08.81	\N	23	0.2
7	Celana Bahan	3	18000	Cuci kering + setrika	2026-06-03 05:03:08.81	2026-06-03 05:03:08.81	\N	23	0.4
8	Sweater Wool	1	35000	Dry clean premium	2026-06-03 05:03:08.81	2026-06-03 05:03:08.81	\N	23	0.75
12	Kemeja Lengan Panjang	2	15000	Cuci + setrika	2026-06-05 03:39:28.02	2026-06-05 03:39:28.02	\N	31	0
13	Celana Bahan	3	18000	Cuci kering + setrika	2026-06-05 03:39:28.02	2026-06-05 03:39:28.02	\N	31	0
14	Sweater Wool	1	35000	Dry clean premium	2026-06-05 03:39:28.02	2026-06-05 03:39:28.02	\N	31	0
15	Kemeja Lengan Panjang	2	15000	Cuci + setrika	2026-06-05 04:39:45.632	2026-06-05 04:39:45.632	\N	31	0.5
16	Celana Bahan	3	18000	Cuci kering + setrika	2026-06-05 04:39:45.632	2026-06-05 04:39:45.632	\N	31	0.3
17	Sweater Wool	1	35000	Dry clean premium	2026-06-05 04:39:45.632	2026-06-05 04:39:45.632	\N	31	1.2
18	Kemeja Lengan Panjang	2	15000	Cuci + setrika	2026-06-05 07:31:34.142	2026-06-05 07:31:34.142	\N	33	0.5
19	Celana Bahan	3	18000	Cuci kering + setrika	2026-06-05 07:31:34.142	2026-06-05 07:31:34.142	\N	33	0.3
20	Sweater Wool	1	35000	Dry clean premium	2026-06-05 07:31:34.142	2026-06-05 07:31:34.142	\N	33	1.2
\.


--
-- Data for Name: order_jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_jobs (id, is_bypassed, bypass_approved, "bypassedBy", station, start_time, end_time, created_at, updated_at, deleted_at, employee_id, outlet_id, order_id, job_id) FROM stdin;
\.


--
-- Data for Name: order_pickups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_pickups (id, status, created_at, updated_at, deleted_at, driver_id, pickup_id, order_id) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, scheduled_time, pickup_time, order_status, delivery_cost, payment_status, payment_method, payment_time, distance, confirmed_at, delivered_at, created_at, updated_at, deleted_at, user_id, outlet_id, order_id, address_id, xendit_session_id) FROM stdin;
23	2026-06-05 12:00:00	\N	WASHING	0	PENDING	BCA_VIRTUAL_ACCOUNT	2026-06-04 08:16:31	0.300000000000000000000000000000	\N	\N	2026-06-02 10:01:43.796	2026-06-04 08:16:32.712	\N	16	4	cmpwgx3780001hcugg6p2yt53	5	ps-6a2134572035e67b7824218c
24	2026-06-11 06:00:00	\N	CANCELLED	0	PENDING	BCA_VIRTUAL_ACCOUNT	2026-06-04 07:39:30	0.300000000000000000000000000000	\N	\N	2026-06-02 13:20:51.09	2026-06-04 07:39:31.321	\N	16	4	cmpwo15si000035ugpv72a0rf	5	ps-6a212baa2035e67b782411a1
31	2026-06-16 07:00:00	2026-06-05 07:31:48.351	READY_TO_DELIVER	0	SUCCESS	BCA_VIRTUAL_ACCOUNT	2026-06-05 07:35:18	15.010000000000000000000000000000	2026-06-05 07:31:34.142	2026-06-05 07:31:34.142	2026-06-04 10:14:41.193	2026-06-05 07:35:20.073	\N	16	17	cmpzc9gdl0001qgugmtilnvq4	6	ps-6a227c1be11e6baf5e5d257b
34	2026-06-17 06:00:00	\N	WAITING_FOR_DRIVER	0	PENDING	\N	\N	0.300000000000000000000000000000	\N	\N	2026-06-06 08:07:21.384	2026-06-06 08:07:21.384	\N	16	4	cmq22leso0000n4ug9u0i6ktv	7	\N
22	2026-06-10 06:00:00	\N	ARRIVED_AT_CUSTOMER	0	PENDING	\N	\N	0.440000000000000000000000000000	2026-05-23 13:15:00	\N	2026-06-02 10:00:24.802	2026-06-02 10:00:24.802	\N	16	9	cmpwgve8y0000hcugtffab5gg	5	\N
33	2026-06-25 03:00:00	2026-06-05 07:31:57.452	WASHING	0	SUCCESS	BCA_VIRTUAL_ACCOUNT	2026-06-08 06:12:28	1.200000000000000000000000000000	\N	\N	2026-06-05 07:31:14.344	2026-06-08 06:12:29.549	\N	16	12	cmq0lv4140000mhugorc0vzw3	5	ps-6a265d452035e67b782aa922
21	2026-05-27 09:00:00	\N	PENDING	16000	SUCCESS	CARDS	2025-02-13 08:29:35.444	4.000000000000000000000000000000	\N	\N	2026-05-31 03:14:07.185	2026-06-05 04:34:39.004	\N	17	1	90392f42-d98a-49ef-a7f3-90392f42d98a	6	\N
15	2026-05-20 09:00:00	2026-05-20 10:00:00	ARRIVED_AT_CUSTOMER	15000	SUCCESS	GOPAY	2026-05-20 08:30:00	3.500000000000000000000000000000	2026-05-20 08:45:00	2026-05-22 14:00:00	2026-05-31 03:14:07.185	2026-05-31 03:14:07.185	\N	16	1	c15aa466-4ed4-4d20-8eab-d300b8bc4add	6	\N
16	2026-05-22 11:00:00	2026-05-22 12:00:00	WASHING	12000	SUCCESS	\N	\N	2.800000000000000000000000000000	\N	\N	2026-05-31 03:14:07.185	2026-05-31 03:14:07.185	\N	16	1	482222c1-5a39-42b0-9272-4910825b0e34	5	\N
17	2026-05-24 08:00:00	\N	PENDING	18000	PENDING	\N	\N	4.200000000000000000000000000000	\N	\N	2026-05-31 03:14:07.185	2026-05-31 03:14:07.185	\N	16	2	1600c188-16c1-4ff1-ad60-d5953c8fb75b	6	\N
18	2026-05-26 14:00:00	\N	WAITING_FOR_PAYMENT	10000	PENDING	\N	\N	1.900000000000000000000000000000	\N	\N	2026-05-31 03:14:07.185	2026-05-31 03:14:07.185	\N	16	2	f106113b-1f06-485c-a77d-95d67773ab5e	5	\N
19	2026-05-21 10:00:00	2026-05-21 11:00:00	ARRIVED_AT_CUSTOMER	20000	SUCCESS	VISA	2026-05-21 09:45:00	5.100000000000000000000000000000	2026-05-21 10:10:00	2026-05-23 12:00:00	2026-05-31 03:14:07.185	2026-05-31 03:14:07.185	\N	17	1	8776f161-8a68-4ace-b2f3-6020f59086ee	6	\N
20	2026-05-23 13:00:00	2026-05-23 14:00:00	OTW_TO_CUSTOMER	14000	SUCCESS	GOPAY	2026-05-23 12:50:00	3.300000000000000000000000000000	2026-05-23 13:15:00	\N	2026-05-31 03:14:07.185	2026-05-31 03:14:07.185	\N	17	2	e08dd17f-a5a9-47df-808c-3e7d12e38f68	5	\N
\.


--
-- Data for Name: outlets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.outlets (id, name, address, city, postal_code, latitude, longitude, created_at, updated_at, deleted_at) FROM stdin;
1	Outlet Pusat	Jl. Sudirman No. 1	Jakarta	10220	-6.208800000000000000000000000000	106.845600000000000000000000000000	2026-05-29 05:49:26.178	2026-05-29 05:49:26.178	\N
2	Outlet Selatan	Jl. Gatot Subroto No. 5	Jakarta	12930	-6.238200000000000000000000000000	106.834900000000000000000000000000	2026-05-29 05:49:26.178	2026-05-29 05:49:26.178	\N
3	Outlet Kelapa Gading 1	Jl. Kelapa Gading Boulevard No. 12	Jakarta Utara	14240	-6.153300000000000000000000000000	106.893600000000000000000000000000	2026-06-01 02:09:18.296	2026-06-01 02:09:18.296	\N
4	Outlet Kelapa Gading 2	Jl. Kelapa Hybrida Raya No. 45	Jakarta Utara	14240	-6.160000000000000000000000000000	106.905000000000000000000000000000	2026-06-01 02:09:18.296	2026-06-01 02:09:18.296	\N
5	Outlet Gajah Mada	Jl. Gajah Mada No. 88	Jakarta Barat	11120	-6.145800000000000000000000000000	106.815300000000000000000000000000	2026-06-01 02:09:18.296	2026-06-01 02:09:18.296	\N
6	Outlet Senopati	Jl. Senopati Raya No. 22	Jakarta Selatan	12110	-6.266000000000000000000000000000	106.813500000000000000000000000000	2026-06-01 02:09:18.296	2026-06-01 02:09:18.296	\N
7	Outlet Pantai Indah Kapuk	Jl. Pantai Indah Utara 2 No. 5	Jakarta Utara	14460	-6.116200000000000000000000000000	106.756200000000000000000000000000	2026-06-01 02:09:18.296	2026-06-01 02:09:18.296	\N
8	Outlet Kemang 1	Jl. Kemang Selatan 1 No. 10	Jakarta Selatan	12560	-6.265100000000000000000000000000	106.818500000000000000000000000000	2026-06-01 05:43:20.096	2026-06-01 05:43:20.096	\N
9	Outlet Kemang 2	Jl. Kemang Raya No. 25	Jakarta Selatan	12560	-6.263600000000000000000000000000	106.816000000000000000000000000000	2026-06-01 05:43:20.096	2026-06-01 05:43:20.096	\N
10	Outlet Pondok Indah 1	Jl. Metro Pondok Indah No. 6	Jakarta Selatan	12310	-6.254600000000000000000000000000	106.757200000000000000000000000000	2026-06-01 05:43:20.096	2026-06-01 05:43:20.096	\N
11	Outlet Pondok Indah 2	Jl. Pondok Indah Raya No. 12	Jakarta Selatan	12310	-6.256500000000000000000000000000	106.754000000000000000000000000000	2026-06-01 05:43:20.096	2026-06-01 05:43:20.096	\N
12	Outlet Menteng 1	Jl. Riau No. 1	Jakarta Pusat	10350	-6.191600000000000000000000000000	106.824500000000000000000000000000	2026-06-01 05:43:20.096	2026-06-01 05:43:20.096	\N
13	Outlet Menteng 2	Jl. Anyer XV No. 9A	Jakarta Pusat	10310	-6.194500000000000000000000000000	106.821000000000000000000000000000	2026-06-01 05:43:20.096	2026-06-01 05:43:20.096	\N
14	Outlet Tanah Abang	Jl. Kebon Jati No. 5	Jakarta Pusat	10240	-6.197200000000000000000000000000	106.803800000000000000000000000000	2026-06-01 05:43:20.096	2026-06-01 05:43:20.096	\N
15	Outlet Sudirman	Jl. Jenderal Sudirman No. 1	Jakarta Pusat	12950	-6.147200000000000000000000000000	106.836100000000000000000000000000	2026-06-01 05:43:20.096	2026-06-01 05:43:20.096	\N
16	Outlet Thamrin	Jl. M.H. Thamrin No. 28	Jakarta Pusat	10310	-6.192500000000000000000000000000	106.812500000000000000000000000000	2026-06-01 05:43:20.096	2026-06-01 05:43:20.096	\N
17	Outlet Pluit 1	Jl. Pluit Raya No. 1	Jakarta Utara	14440	-6.126200000000000000000000000000	106.801900000000000000000000000000	2026-06-01 05:43:20.096	2026-06-01 05:43:20.096	\N
18	Outlet Pluit 2	Jl. Pluit Selatan No. 2	Jakarta Utara	14450	-6.130500000000000000000000000000	106.799800000000000000000000000000	2026-06-01 05:43:20.096	2026-06-01 05:43:20.096	\N
19	Outlet Mangga Dua	Jl. Gunung Sahari Raya No. 1	Jakarta Utara	14420	-6.138200000000000000000000000000	106.831700000000000000000000000000	2026-06-01 05:43:20.096	2026-06-01 05:43:20.096	\N
20	Outlet Puri Indah	Jl. Puri Indah Raya No. 8	Jakarta Barat	11610	-6.188000000000000000000000000000	106.734000000000000000000000000000	2026-06-01 05:43:20.096	2026-06-01 05:43:20.096	\N
21	Outlet Cibubur	Jl. Jambore No. 1	Jakarta Timur	13720	-6.369300000000000000000000000000	106.894100000000000000000000000000	2026-06-01 05:43:20.096	2026-06-01 05:43:20.096	\N
22	Outlet Tebet	Jl. Tebet Raya No. 15	Jakarta Selatan	12870	-6.230000000000000000000000000000	106.850400000000000000000000000000	2026-06-01 05:43:20.096	2026-06-01 05:43:20.096	\N
\.


--
-- Data for Name: provinces; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.provinces (code, name) FROM stdin;
31	DKI Jakarta
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_tokens (id, token, "expiredAt", "createdAt", "updatedAt", "userId") FROM stdin;
23	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsInJvbGUiOiJVU0VSIiwiZnVsbE5hbWUiOiJKb24gU25vdyBhc2QiLCJlbWFpbCI6ImRhdmV0ZXJ1M0BnbWFpbC5jb20iLCJpYXQiOjE3ODA3NTQzOTYsImV4cCI6MTc4MTM1OTE5Nn0.YOkwRpiaj_Gy0XTOJFPTq4Zj-0Op8NBjAPl1njZSTa0	2026-06-07 06:47:56.938	2026-05-23 10:59:06.332	2026-06-06 13:59:56.943	17
81	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTgsInJvbGUiOiJEUklWRVIiLCJmdWxsTmFtZSI6InRlcnUgdGVydSIsImVtYWlsIjoiZHJpdmVydGVzdEBnbWFpbC5jb20iLCJpYXQiOjE3ODA4OTc1NDMsImV4cCI6MTc4MTUwMjM0M30.qJpD__ZdO-5Hp8vNsQJ7uq4z_1jPQlM75LEzNOMq0B4	2026-06-08 22:33:43.112	2026-05-25 15:29:56.499	2026-06-08 05:45:43.12	18
29	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTYsInJvbGUiOiJVU0VSIiwiZnVsbE5hbWUiOiJEYXZpZCBUZXJ1IiwiZW1haWwiOiJkYXZldGVydUBnbWFpbC5jb20iLCJpYXQiOjE3ODA4OTc5MjksImV4cCI6MTc4MTUwMjcyOX0.kbWWU7lfQ0_QbCqUOm3n8IuYiJilkYEz4MKoJku1EWY	2026-06-08 22:40:09.612	2026-05-23 12:58:28.942	2026-06-08 05:52:09.619	16
\.


--
-- Data for Name: regencies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.regencies (code, name, province_code) FROM stdin;
31.01	Kabupaten Administrasi Kepulauan Seribu	31
31.71	Kota Administrasi Jakarta Pusat	31
31.72	Kota Administrasi Jakarta Utara	31
31.73	Kota Administrasi Jakarta Barat	31
31.74	Kota Administrasi Jakarta Selatan	31
31.75	Kota Administrasi Jakarta Timur	31
\.


--
-- Data for Name: user_addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_addresses (id, address, city, postal_code, latitude, longitude, is_primary, created_at, updated_at, deleted_at, user_id, label, district_code, regency_code, village_code) FROM stdin;
12	asdasd	asdasd	asdasd	1.100000000000000000000000000000	1.100000000000000000000000000000	f	2026-05-28 05:53:51.831	2026-05-28 06:08:06.243	\N	17	d	\N	\N	\N
16	123	123	123	123.000000000000000000000000000000	123.000000000000000000000000000000	f	2026-06-05 08:13:08.329	2026-06-05 08:13:32.164	2026-06-05 08:13:32.164	16	123	\N	\N	\N
13	123123	123123	123123	1.100000000000000000000000000000	1.100000000000000000000000000000	f	2026-05-28 06:21:47.99	2026-05-28 11:24:49.744	2026-05-28 11:24:49.744	16	123123	\N	\N	\N
14	123	123	123	123.000000000000000000000000000000	123.000000000000000000000000000000	f	2026-05-28 11:25:56.091	2026-05-28 11:25:59.679	2026-05-28 11:25:59.679	16	123	\N	\N	\N
9	Jl. Kemang Raya No. 12, Bangka	Jakarta Selatan	12730	-6.260700000000000000000000000000	106.813300000000000000000000000000	f	2026-05-26 13:28:54.267	2026-05-28 06:08:04.949	\N	17	Office123	31.01.02	31.01	\N
10	Jl. PANTAI INDAH KAPUK 123	Jakarta Utara	9999	-6.158900000000000000000000000000	106.907500000000000000000000000000	f	2026-05-26 13:28:54.267	2026-05-28 05:42:07.021	\N	17	Gudang ke 10	31.01.02	31.01	\N
11	Jl. Sunter Agung paradise 22	Jakarta Utara	14240	-6.158900000000000000000000000000	106.907500000000000000000000000000	t	2026-05-26 13:28:54.267	2026-06-01 15:50:42.552	\N	17	Komplek A	31.01.02	31.01	\N
7	Jl. Kelapa Gading Boulevard No. 8, Kelapa Gading	Jakarta Utara	14240	-6.158900000000000000000000000000	106.907500000000000000000000000000	f	2026-05-26 13:28:54.267	2026-06-06 12:43:23.308	\N	16	Gudang Kelapa Gading	31.72.06	31.72	31.72.06.1001
8	Sunter Paradise 22	Jakarta Pusat	10250	-6.198705000000000000000000000000	106.832612000000000000000000000000	f	2026-05-26 13:28:54.267	2026-06-06 14:08:01.525	\N	17	Home	31.72.02	31.72	31.72.02.1006
6	Jl. Kemang Raya No. 12, Bangka	Jakarta Selatan	12730	-6.260700000000000000000000000000	106.813300000000000000000000000000	f	2026-05-26 13:28:54.267	2026-06-06 15:17:42.906	\N	16	Apartment Kemang Village	31.74.03	31.74	31.74.03.1002
5	Taman Suropati (test)	Jakarta Pusat	10250	-6.198705000000000000000000000000	106.832612000000000000000000000000	t	2026-05-26 13:28:54.267	2026-06-06 15:17:42.917	\N	16	Rumah Utama test	31.71.06	31.71	31.71.06.1001
15	123	123	123	123.000000000000000000000000000000	123.000000000000000000000000000000	f	2026-06-05 08:12:53.244	2026-06-05 08:12:57.627	2026-06-05 08:12:57.625	16	123	\N	\N	\N
\.


--
-- Data for Name: user_notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_notifications (created_at, deleted_at, notification_id, read_at, user_id) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, birth_date, phone, role, avatar, full_name, provider, verified_at, created_at, updated_at, deleted_at) FROM stdin;
16	daveteru@gmail.com		1994-08-16 00:00:00	081285338235	USER	https://res.cloudinary.com/dbjnkjxli/image/upload/v1779695330/ro8eyb7dsw4ejjs9nrno.png	David Teru	GOOGLE	2026-05-28 06:16:36.993	2026-05-22 04:53:33.717	2026-05-25 07:48:51.401	\N
18	drivertest@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$uk4989oJoZ3WjK8jOY6XUQ$V2vQPq/olAZAX+BXN0g/76cZjRgLvSAo6qwqhicb2RA	2026-05-05 00:00:00	081231234123	DRIVER	https://res.cloudinary.com/dbjnkjxli/image/upload/v1779723022/dkkamvlw1lpta2sohwhd.png	teru teru	CREDENTIALS	2026-05-25 15:29:46.307	2026-05-25 15:29:46.313	2026-05-25 15:31:01.342	\N
17	rubahtempur@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$vXpKRMXbfG5cqidJ1IQbvg$A509B3JGcD3x5XbsjzqkeTBlIMLYR7OVgVvlushds5s	1994-08-16 00:00:00	88888888888	USER	https://res.cloudinary.com/dbjnkjxli/image/upload/v1779948900/t35s3zogd5hchternlwj.png	Jon Snow asd	CREDENTIALS	2026-06-06 14:06:01.131	2026-05-22 12:00:48.898	2026-06-06 14:06:01.131	\N
\.


--
-- Data for Name: villages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.villages (code, name, district_code) FROM stdin;
31.01.01.1001	Pulau Panggang	31.01.01
31.01.01.1002	Pulau Kelapa	31.01.01
31.01.01.1003	Pulau Harapan	31.01.01
31.01.02.1001	Pulau Untung Jawa	31.01.02
31.01.02.1002	Pulau Tidung	31.01.02
31.01.02.1003	Pulau Pari	31.01.02
31.71.01.1001	Gambir	31.71.01
31.71.01.1002	Cideng	31.71.01
31.71.01.1003	Petojo Utara	31.71.01
31.71.01.1004	Petojo Selatan	31.71.01
31.71.01.1005	Kebon Kelapa	31.71.01
31.71.01.1006	Duri Pulo	31.71.01
31.71.02.1001	Pasar Baru	31.71.02
31.71.02.1002	Karang Anyar	31.71.02
31.71.02.1003	Kartini	31.71.02
31.71.02.1004	Gunung Sahari Utara	31.71.02
31.71.02.1005	Mangga Dua Selatan	31.71.02
31.71.03.1001	Kemayoran	31.71.03
31.71.03.1002	Kebon Kosong	31.71.03
31.71.03.1003	Harapan Mulia	31.71.03
31.71.03.1004	Serdang	31.71.03
31.71.03.1005	Gunung Sahari Selatan	31.71.03
31.71.03.1006	Cempaka Baru	31.71.03
31.71.03.1007	Sumur Batu	31.71.03
31.71.03.1008	Utan Panjang	31.71.03
31.71.04.1001	Senen	31.71.04
31.71.04.1002	Kenari	31.71.04
31.71.04.1003	Paseban	31.71.04
31.71.04.1004	Kramat	31.71.04
31.71.04.1005	Kwitang	31.71.04
31.71.04.1006	Bungur	31.71.04
31.71.05.1001	Cempaka Putih Timur	31.71.05
31.71.05.1002	Cempaka Putih Barat	31.71.05
31.71.05.1003	Rawasari	31.71.05
31.71.06.1001	Menteng	31.71.06
31.71.06.1002	Pegangsaan	31.71.06
31.71.06.1003	Cikini	31.71.06
31.71.06.1004	Gondangdia	31.71.06
31.71.06.1005	Kebon Sirih	31.71.06
31.71.07.1001	Gelora	31.71.07
31.71.07.1002	Bendungan Hilir	31.71.07
31.71.07.1003	Karet Tengsin	31.71.07
31.71.07.1004	Petamburan	31.71.07
31.71.07.1005	Kebon Melati	31.71.07
31.71.07.1006	Kebon Kacang	31.71.07
31.71.07.1007	Kampung Bali	31.71.07
31.71.08.1001	Johar Baru	31.71.08
31.71.08.1002	Kampung Rawa	31.71.08
31.71.08.1003	Galur	31.71.08
31.71.08.1004	Tanah Tinggi	31.71.08
31.72.01.1001	Penjaringan	31.72.01
31.72.01.1002	Kamal Muara	31.72.01
31.72.01.1003	Kapuk Muara	31.72.01
31.72.01.1004	Pejagalan	31.72.01
31.72.01.1005	Pluit	31.72.01
31.72.02.1001	Tanjung Priok	31.72.02
31.72.02.1002	Sunter Jaya	31.72.02
31.72.02.1003	Papanggo	31.72.02
31.72.02.1004	Sungai Bambu	31.72.02
31.72.02.1005	Kebon Bawang	31.72.02
31.72.02.1006	Sunter Agung	31.72.02
31.72.02.1007	Warakas	31.72.02
31.72.03.1001	Koja	31.72.03
31.72.03.1002	Tugu Utara	31.72.03
31.72.03.1003	Lagoa	31.72.03
31.72.03.1004	Rawa Badak Utara	31.72.03
31.72.03.1005	Tugu Selatan	31.72.03
31.72.03.1006	Rawa Badak Selatan	31.72.03
31.72.04.1001	Cilincing	31.72.04
31.72.04.1002	Sukapura	31.72.04
31.72.04.1003	Marunda	31.72.04
31.72.04.1004	Kalibaru	31.72.04
31.72.04.1005	Semper Timur	31.72.04
31.72.04.1006	Rorotan	31.72.04
31.72.04.1007	Semper Barat	31.72.04
31.72.05.1001	Pademangan Timur	31.72.05
31.72.05.1002	Pademangan Barat	31.72.05
31.72.05.1003	Ancol	31.72.05
31.72.06.1001	Kelapa Gading Timur	31.72.06
31.72.06.1002	Pegangsaan Dua	31.72.06
31.72.06.1003	Kelapa Gading Barat	31.72.06
31.73.01.1001	Cengkareng Barat	31.73.01
31.73.01.1002	Duri Kosambi	31.73.01
31.73.01.1003	Rawa Buaya	31.73.01
31.73.01.1004	Kedaung Kali Angke	31.73.01
31.73.01.1005	Kapuk	31.73.01
31.73.01.1006	Cengkareng Timur	31.73.01
31.73.02.1001	Grogol	31.73.02
31.73.02.1002	Tanjung Duren Utara	31.73.02
31.73.02.1003	Tomang	31.73.02
31.73.02.1004	Jelambar	31.73.02
31.73.02.1005	Tanjung Duren Selatan	31.73.02
31.73.02.1006	Jelambar Baru	31.73.02
31.73.02.1007	Wijaya Kusuma	31.73.02
31.73.03.1001	Taman Sari	31.73.03
31.73.03.1002	Krukut	31.73.03
31.73.03.1003	Maphar	31.73.03
31.73.03.1004	Tangki	31.73.03
31.73.03.1005	Mangga Besar	31.73.03
31.73.03.1006	Keagungan	31.73.03
31.73.03.1007	Glodok	31.73.03
31.73.03.1008	Pinangsia	31.73.03
31.73.04.1001	Tambora	31.73.04
31.73.04.1002	Kali Anyar	31.73.04
31.73.04.1003	Duri Utara	31.73.04
31.73.04.1004	Tanah Sereal	31.73.04
31.73.04.1005	Krendang	31.73.04
31.73.04.1006	Jembatan Besi	31.73.04
31.73.04.1007	Angke	31.73.04
31.73.04.1008	Jembatan Lima	31.73.04
31.73.04.1009	Pekojan	31.73.04
31.73.04.1010	Roa Malaka	31.73.04
31.73.04.1011	Duri Selatan	31.73.04
31.73.05.1001	Kebon Jeruk	31.73.05
31.73.05.1002	Sukabumi Utara	31.73.05
31.73.05.1003	Sukabumi Selatan	31.73.05
31.73.05.1004	Kelapa Dua	31.73.05
31.73.05.1005	Duri Kepa	31.73.05
31.73.05.1006	Kedoya Utara	31.73.05
31.73.05.1007	Kedoya Selatan	31.73.05
31.73.06.1001	Kalideres	31.73.06
31.73.06.1002	Semanan	31.73.06
31.73.06.1003	Tegal Alur	31.73.06
31.73.06.1004	Kamal	31.73.06
31.73.06.1005	Pegadungan	31.73.06
31.73.07.1001	Palmerah	31.73.07
31.73.07.1002	Slipi	31.73.07
31.73.07.1003	Kota Bambu Utara	31.73.07
31.73.07.1004	Jatipulo	31.73.07
31.73.07.1005	Kemanggisan	31.73.07
31.73.07.1006	Kota Bambu Selatan	31.73.07
31.73.08.1001	Kembangan Utara	31.73.08
31.73.08.1002	Meruya Utara	31.73.08
31.73.08.1003	Meruya Selatan	31.73.08
31.73.08.1004	Srengseng	31.73.08
31.73.08.1005	Joglo	31.73.08
31.73.08.1006	Kembangan Selatan	31.73.08
31.74.01.1001	Tebet Timur	31.74.01
31.74.01.1002	Tebet Barat	31.74.01
31.74.01.1003	Menteng Dalam	31.74.01
31.74.01.1004	Kebon Baru	31.74.01
31.74.01.1005	Bukit Duri	31.74.01
31.74.01.1006	Manggarai Selatan	31.74.01
31.74.01.1007	Manggarai	31.74.01
31.74.02.1001	Setia Budi	31.74.02
31.74.02.1002	Karet Semanggi	31.74.02
31.74.02.1003	Karet Kuningan	31.74.02
31.74.02.1004	Karet	31.74.02
31.74.02.1005	Menteng Atas	31.74.02
31.74.02.1006	Pasar Manggis	31.74.02
31.74.02.1007	Guntur	31.74.02
31.74.02.1008	Kuningan Timur	31.74.02
31.74.03.1001	Mampang Prapatan	31.74.03
31.74.03.1002	Bangka	31.74.03
31.74.03.1003	Pela Mampang	31.74.03
31.74.03.1004	Tegal Parang	31.74.03
31.74.03.1005	Kuningan Barat	31.74.03
31.74.04.1001	Pasar Minggu	31.74.04
31.74.04.1002	Jati Padang	31.74.04
31.74.04.1003	Cilandak Timur	31.74.04
31.74.04.1004	Ragunan	31.74.04
31.74.04.1005	Pejaten Timur	31.74.04
31.74.04.1006	Pejaten Barat	31.74.04
31.74.04.1007	Kebagusan	31.74.04
31.74.05.1001	Kebayoran Lama Utara	31.74.05
31.74.05.1002	Pondok Pinang	31.74.05
31.74.05.1003	Cipulir	31.74.05
31.74.05.1004	Grogol Utara	31.74.05
31.74.05.1005	Grogol Selatan	31.74.05
31.74.05.1006	Kebayoran Lama Selatan	31.74.05
31.74.06.1001	Cilandak Barat	31.74.06
31.74.06.1002	Lebak Bulus	31.74.06
31.74.06.1003	Pondok Labu	31.74.06
31.74.06.1004	Gandaria Selatan	31.74.06
31.74.06.1005	Cipete Selatan	31.74.06
31.74.07.1001	Melawai	31.74.07
31.74.07.1002	Gunung	31.74.07
31.74.07.1003	Kramat Pela	31.74.07
31.74.07.1004	Selong	31.74.07
31.74.07.1005	Rawa Barat	31.74.07
31.74.07.1006	Senayan	31.74.07
31.74.07.1007	Pulo	31.74.07
31.74.07.1008	Petogogan	31.74.07
31.74.07.1009	Gandaria Utara	31.74.07
31.74.07.1010	Cipete Utara	31.74.07
31.74.08.1001	Pancoran	31.74.08
31.74.08.1002	Kalibata	31.74.08
31.74.08.1003	Rawajati	31.74.08
31.74.08.1004	Duren Tiga	31.74.08
31.74.08.1005	Pengadegan	31.74.08
31.74.08.1006	Cikoko	31.74.08
31.74.09.1001	Jagakarsa	31.74.09
31.74.09.1002	Srengseng Sawah	31.74.09
31.74.09.1003	Ciganjur	31.74.09
31.74.09.1004	Lenteng Agung	31.74.09
31.74.09.1005	Tanjung Barat	31.74.09
31.74.09.1006	Cipedak	31.74.09
31.74.10.1001	Pesanggrahan	31.74.10
31.74.10.1002	Bintaro	31.74.10
31.74.10.1003	Petukangan Utara	31.74.10
31.74.10.1004	Petukangan Selatan	31.74.10
31.74.10.1005	Ulujami	31.74.10
31.75.01.1001	Pisangan Baru	31.75.01
31.75.01.1002	Utan Kayu Utara	31.75.01
31.75.01.1003	Kayu Manis	31.75.01
31.75.01.1004	Palmeriam	31.75.01
31.75.01.1005	Kebon Manggis	31.75.01
31.75.01.1006	Utan Kayu Selatan	31.75.01
31.75.02.1001	Pulo Gadung	31.75.02
31.75.02.1002	Pisangan Timur	31.75.02
31.75.02.1003	Cipinang	31.75.02
31.75.02.1004	Jatinegara Kaum	31.75.02
31.75.02.1005	Rawamangun	31.75.02
31.75.02.1006	Kayu Putih	31.75.02
31.75.02.1007	Jati	31.75.02
31.75.03.1001	Kampung Melayu	31.75.03
31.75.03.1002	Bidara Cina	31.75.03
31.75.03.1003	Bali Mester	31.75.03
31.75.03.1004	Rawa Bunga	31.75.03
31.75.03.1005	Cipinang Cempedak	31.75.03
31.75.03.1006	Cipinang Muara	31.75.03
31.75.03.1007	Cipinang Besar Selatan	31.75.03
31.75.03.1008	Cipinang Besar Utara	31.75.03
31.75.04.1001	Kramatjati	31.75.04
31.75.04.1002	Tengah	31.75.04
31.75.04.1003	Dukuh	31.75.04
31.75.04.1004	Batu Ampar	31.75.04
31.75.04.1005	Balekambang	31.75.04
31.75.04.1006	Cililitan	31.75.04
31.75.04.1007	Cawang	31.75.04
31.75.05.1001	Gedong	31.75.05
31.75.05.1002	Baru	31.75.05
31.75.05.1003	Cijantung	31.75.05
31.75.05.1004	Kalisari	31.75.05
31.75.05.1005	Pekayon	31.75.05
31.75.06.1001	Jatinegara	31.75.06
31.75.06.1002	Rawa Terate	31.75.06
31.75.06.1003	Penggilingan	31.75.06
31.75.06.1004	Cakung Timur	31.75.06
31.75.06.1005	Pulo Gebang	31.75.06
31.75.06.1006	Ujung Menteng	31.75.06
31.75.06.1007	Cakung Barat	31.75.06
31.75.07.1001	Duren Sawit	31.75.07
31.75.07.1002	Pondok Bambu	31.75.07
31.75.07.1003	Klender	31.75.07
31.75.07.1004	Pondok Kelapa	31.75.07
31.75.07.1005	Malaka Sari	31.75.07
31.75.07.1006	Malaka Jaya	31.75.07
31.75.07.1007	Pondok Kopi	31.75.07
31.75.08.1001	Makasar	31.75.08
31.75.08.1002	Pinangranti	31.75.08
31.75.08.1003	Kebon Pala	31.75.08
31.75.08.1004	Halim Perdana Kusuma	31.75.08
31.75.08.1005	Cipinang Melayu	31.75.08
31.75.09.1001	Ciracas	31.75.09
31.75.09.1002	Cibubur	31.75.09
31.75.09.1003	Kelapa Dua Wetan	31.75.09
31.75.09.1004	Susukan	31.75.09
31.75.09.1005	Rambutan	31.75.09
31.75.10.1001	Cipayung	31.75.10
31.75.10.1002	Cilangkap	31.75.10
31.75.10.1003	Pondok Ranggon	31.75.10
31.75.10.1004	Munjul	31.75.10
31.75.10.1005	Setu	31.75.10
31.75.10.1006	Bambu Apus	31.75.10
31.75.10.1007	Lubang Buaya	31.75.10
31.75.10.1008	Ceger	31.75.10
\.


--
-- Name: attendances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attendances_id_seq', 1, false);


--
-- Name: complaints_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.complaints_id_seq', 1, false);


--
-- Name: employees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employees_id_seq', 1, false);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 10, true);


--
-- Name: order_deliveries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_deliveries_id_seq', 1, false);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 20, true);


--
-- Name: order_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_jobs_id_seq', 1, false);


--
-- Name: order_pickups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_pickups_id_seq', 3, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 34, true);


--
-- Name: outlets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.outlets_id_seq', 22, true);


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.refresh_tokens_id_seq', 139, true);


--
-- Name: user_addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_addresses_id_seq', 16, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 19, true);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: attendances attendances_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT attendances_pkey PRIMARY KEY (id);


--
-- Name: complaints complaints_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_pkey PRIMARY KEY (id);


--
-- Name: districts districts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.districts
    ADD CONSTRAINT districts_pkey PRIMARY KEY (code);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: order_deliveries order_deliveries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_deliveries
    ADD CONSTRAINT order_deliveries_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: order_jobs order_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_jobs
    ADD CONSTRAINT order_jobs_pkey PRIMARY KEY (id);


--
-- Name: order_pickups order_pickups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_pickups
    ADD CONSTRAINT order_pickups_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: outlets outlets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.outlets
    ADD CONSTRAINT outlets_pkey PRIMARY KEY (id);


--
-- Name: provinces provinces_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provinces
    ADD CONSTRAINT provinces_pkey PRIMARY KEY (code);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: regencies regencies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.regencies
    ADD CONSTRAINT regencies_pkey PRIMARY KEY (code);


--
-- Name: user_addresses user_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_addresses
    ADD CONSTRAINT user_addresses_pkey PRIMARY KEY (id);


--
-- Name: user_notifications user_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_notifications
    ADD CONSTRAINT user_notifications_pkey PRIMARY KEY (user_id, notification_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: villages villages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.villages
    ADD CONSTRAINT villages_pkey PRIMARY KEY (code);


--
-- Name: complaints_ticket_number_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX complaints_ticket_number_key ON public.complaints USING btree (ticket_number);


--
-- Name: employees_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX employees_user_id_key ON public.employees USING btree (user_id);


--
-- Name: order_deliveries_delivery_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX order_deliveries_delivery_id_key ON public.order_deliveries USING btree (delivery_id);


--
-- Name: order_pickups_pickup_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX order_pickups_pickup_id_key ON public.order_pickups USING btree (pickup_id);


--
-- Name: orders_order_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX orders_order_id_key ON public.orders USING btree (order_id);


--
-- Name: refresh_tokens_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX refresh_tokens_token_key ON public.refresh_tokens USING btree (token);


--
-- Name: refresh_tokens_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "refresh_tokens_userId_key" ON public.refresh_tokens USING btree ("userId");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: attendances attendances_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT attendances_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: complaints complaints_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: complaints complaints_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: districts districts_regency_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.districts
    ADD CONSTRAINT districts_regency_code_fkey FOREIGN KEY (regency_code) REFERENCES public.regencies(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: employees employees_outlet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_outlet_id_fkey FOREIGN KEY (outlet_id) REFERENCES public.outlets(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: employees employees_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: order_deliveries order_deliveries_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_deliveries
    ADD CONSTRAINT order_deliveries_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: order_jobs order_jobs_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_jobs
    ADD CONSTRAINT order_jobs_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order_jobs order_jobs_outlet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_jobs
    ADD CONSTRAINT order_jobs_outlet_id_fkey FOREIGN KEY (outlet_id) REFERENCES public.outlets(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: order_pickups order_pickups_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_pickups
    ADD CONSTRAINT order_pickups_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: orders orders_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.user_addresses(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: orders orders_outlet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_outlet_id_fkey FOREIGN KEY (outlet_id) REFERENCES public.outlets(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: refresh_tokens refresh_tokens_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: regencies regencies_province_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.regencies
    ADD CONSTRAINT regencies_province_code_fkey FOREIGN KEY (province_code) REFERENCES public.provinces(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: user_addresses user_addresses_district_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_addresses
    ADD CONSTRAINT user_addresses_district_code_fkey FOREIGN KEY (district_code) REFERENCES public.districts(code) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: user_addresses user_addresses_regency_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_addresses
    ADD CONSTRAINT user_addresses_regency_code_fkey FOREIGN KEY (regency_code) REFERENCES public.regencies(code) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: user_addresses user_addresses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_addresses
    ADD CONSTRAINT user_addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: user_addresses user_addresses_village_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_addresses
    ADD CONSTRAINT user_addresses_village_code_fkey FOREIGN KEY (village_code) REFERENCES public.villages(code) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: user_notifications user_notifications_notification_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_notifications
    ADD CONSTRAINT user_notifications_notification_id_fkey FOREIGN KEY (notification_id) REFERENCES public.notifications(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: user_notifications user_notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_notifications
    ADD CONSTRAINT user_notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: villages villages_district_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.villages
    ADD CONSTRAINT villages_district_code_fkey FOREIGN KEY (district_code) REFERENCES public.districts(code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict OpWdtml8AqmRgI5gZfphS14lhI216qIxxYuCJJ0fVuvH2EGqMS5iZlxNCchI5qD

