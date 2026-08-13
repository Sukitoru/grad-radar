--
-- PostgreSQL database dump
--

\restrict 3oBHGpktIMEUMegaOrlOzXDSYxYtaSj9bc7Q677mefo3agypirLNF7ZRa50xdIZ

-- Dumped from database version 16.14 (Homebrew)
-- Dumped by pg_dump version 16.14 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.programs DROP CONSTRAINT IF EXISTS "programs_schoolId_fkey";
ALTER TABLE IF EXISTS ONLY public.decisions DROP CONSTRAINT IF EXISTS "decisions_waitlistUntilTermId_fkey";
ALTER TABLE IF EXISTS ONLY public.decisions DROP CONSTRAINT IF EXISTS "decisions_applicationId_fkey";
ALTER TABLE IF EXISTS ONLY public.applications DROP CONSTRAINT IF EXISTS "applications_userId_fkey";
ALTER TABLE IF EXISTS ONLY public.applications DROP CONSTRAINT IF EXISTS "applications_termId_fkey";
ALTER TABLE IF EXISTS ONLY public.applications DROP CONSTRAINT IF EXISTS "applications_schoolId_fkey";
ALTER TABLE IF EXISTS ONLY public.applications DROP CONSTRAINT IF EXISTS "applications_programId_fkey";
DROP INDEX IF EXISTS public.users_username_key;
DROP INDEX IF EXISTS public."terms_name_academicYear_key";
DROP INDEX IF EXISTS public.schools_name_key;
DROP INDEX IF EXISTS public."programs_schoolId_name_degreeLevel_key";
DROP INDEX IF EXISTS public."programs_schoolId_idx";
DROP INDEX IF EXISTS public."decisions_waitlistUntilTermId_idx";
DROP INDEX IF EXISTS public."decisions_status_decisionDate_idx";
DROP INDEX IF EXISTS public."decisions_applicationId_key";
DROP INDEX IF EXISTS public."applications_userId_idx";
DROP INDEX IF EXISTS public."applications_termId_idx";
DROP INDEX IF EXISTS public."applications_schoolId_idx";
DROP INDEX IF EXISTS public."applications_programId_idx";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.terms DROP CONSTRAINT IF EXISTS terms_pkey;
ALTER TABLE IF EXISTS ONLY public.schools DROP CONSTRAINT IF EXISTS schools_pkey;
ALTER TABLE IF EXISTS ONLY public.programs DROP CONSTRAINT IF EXISTS programs_pkey;
ALTER TABLE IF EXISTS ONLY public.decisions DROP CONSTRAINT IF EXISTS decisions_pkey;
ALTER TABLE IF EXISTS ONLY public.applications DROP CONSTRAINT IF EXISTS applications_pkey;
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.terms;
DROP TABLE IF EXISTS public.schools;
DROP TABLE IF EXISTS public.programs;
DROP TABLE IF EXISTS public.decisions;
DROP TABLE IF EXISTS public.applications;
DROP TABLE IF EXISTS public._prisma_migrations;
DROP TYPE IF EXISTS public."DegreeLevel";
DROP TYPE IF EXISTS public."DecisionStatus";
DROP SCHEMA IF EXISTS public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: DecisionStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."DecisionStatus" AS ENUM (
    'ACCEPTED',
    'REJECTED',
    'WAITLISTED'
);


--
-- Name: DegreeLevel; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."DegreeLevel" AS ENUM (
    'Masters',
    'Doctoral'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.applications (
    id uuid NOT NULL,
    "userId" uuid NOT NULL,
    "schoolId" uuid NOT NULL,
    "programId" uuid NOT NULL,
    "termId" uuid NOT NULL,
    gpa numeric(3,2),
    awards text[] DEFAULT ARRAY[]::text[] NOT NULL,
    publications integer DEFAULT 0 NOT NULL,
    "submissionDate" date,
    "createdAt" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) with time zone NOT NULL,
    comments text,
    CONSTRAINT applications_awards_limit CHECK ((cardinality(awards) <= 5)),
    CONSTRAINT applications_publications_limit CHECK (((publications >= 0) AND (publications <= 100)))
);


--
-- Name: decisions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.decisions (
    id uuid NOT NULL,
    "applicationId" uuid NOT NULL,
    status public."DecisionStatus" NOT NULL,
    "decisionDate" date NOT NULL,
    "createdAt" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) with time zone NOT NULL,
    "waitlistUntilTermId" uuid
);


--
-- Name: programs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.programs (
    id uuid NOT NULL,
    "schoolId" uuid NOT NULL,
    name character varying(160) NOT NULL,
    "degreeLevel" public."DegreeLevel" NOT NULL,
    "createdAt" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) with time zone NOT NULL
);


--
-- Name: schools; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schools (
    id uuid NOT NULL,
    name character varying(160) NOT NULL,
    "createdAt" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) with time zone NOT NULL
);


--
-- Name: terms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.terms (
    id uuid NOT NULL,
    name character varying(30) NOT NULL,
    "academicYear" integer NOT NULL,
    "startDate" date,
    "endDate" date,
    "createdAt" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) with time zone NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    username character varying(50) NOT NULL,
    "passwordHash" character varying(255) NOT NULL,
    "createdAt" timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) with time zone NOT NULL,
    "defaultGpa" numeric(3,2),
    "defaultAwards" text[] DEFAULT ARRAY[]::text[] NOT NULL,
    "defaultPublications" integer DEFAULT 0 NOT NULL,
    CONSTRAINT "users_defaultAwards_limit" CHECK ((cardinality("defaultAwards") <= 5)),
    CONSTRAINT "users_defaultPublications_limit" CHECK ((("defaultPublications" >= 0) AND ("defaultPublications" <= 100)))
);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- Name: decisions decisions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.decisions
    ADD CONSTRAINT decisions_pkey PRIMARY KEY (id);


--
-- Name: programs programs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_pkey PRIMARY KEY (id);


--
-- Name: schools schools_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_pkey PRIMARY KEY (id);


--
-- Name: terms terms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.terms
    ADD CONSTRAINT terms_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: applications_programId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "applications_programId_idx" ON public.applications USING btree ("programId");


--
-- Name: applications_schoolId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "applications_schoolId_idx" ON public.applications USING btree ("schoolId");


--
-- Name: applications_termId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "applications_termId_idx" ON public.applications USING btree ("termId");


--
-- Name: applications_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "applications_userId_idx" ON public.applications USING btree ("userId");


--
-- Name: decisions_applicationId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "decisions_applicationId_key" ON public.decisions USING btree ("applicationId");


--
-- Name: decisions_status_decisionDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "decisions_status_decisionDate_idx" ON public.decisions USING btree (status, "decisionDate");


--
-- Name: decisions_waitlistUntilTermId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "decisions_waitlistUntilTermId_idx" ON public.decisions USING btree ("waitlistUntilTermId");


--
-- Name: programs_schoolId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "programs_schoolId_idx" ON public.programs USING btree ("schoolId");


--
-- Name: programs_schoolId_name_degreeLevel_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "programs_schoolId_name_degreeLevel_key" ON public.programs USING btree ("schoolId", name, "degreeLevel");


--
-- Name: schools_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX schools_name_key ON public.schools USING btree (name);


--
-- Name: terms_name_academicYear_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "terms_name_academicYear_key" ON public.terms USING btree (name, "academicYear");


--
-- Name: users_username_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);


--
-- Name: applications applications_programId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_programId_fkey" FOREIGN KEY ("programId") REFERENCES public.programs(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: applications applications_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public.schools(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: applications applications_termId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_termId_fkey" FOREIGN KEY ("termId") REFERENCES public.terms(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: applications applications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT "applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: decisions decisions_applicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.decisions
    ADD CONSTRAINT "decisions_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES public.applications(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: decisions decisions_waitlistUntilTermId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.decisions
    ADD CONSTRAINT "decisions_waitlistUntilTermId_fkey" FOREIGN KEY ("waitlistUntilTermId") REFERENCES public.terms(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: programs programs_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT "programs_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public.schools(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict 3oBHGpktIMEUMegaOrlOzXDSYxYtaSj9bc7Q677mefo3agypirLNF7ZRa50xdIZ

--
-- PostgreSQL database dump
--

\restrict ifN1qY6yJORLvAO6KmbuOQCpWJX5ROsBROXDeBNgqlKJ4zzcob0G2pqsQZANAKN

-- Dumped from database version 16.14 (Homebrew)
-- Dumped by pg_dump version 16.14 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
935dbf0a-6cc0-417d-9f1a-c890cfbfa906	0c6d9afaeeef61bd3d00b76043e7254b61eb1dd6f9f8659e8ecc280c18898815	2026-08-11 11:35:49.616119-04	20260811153549_init	\N	\N	2026-08-11 11:35:49.600337-04	1
5012b822-317b-4d30-babd-590d1f04e4d9	8bdca6c3a5a85491c9f1aa3c937aa07f8b8d013560f063a15225f6da56960ef5	2026-08-13 10:29:32.655395-04	20260813103000_add_profile_and_application_details	\N	\N	2026-08-13 10:29:32.632565-04	1
73aeed82-9c69-4c9b-9082-e6dffef8bee5	7e95f1be4712ff46bb12a53d0a7b02b3751f847a45d9cd03f037f85fd5f01d5f	2026-08-13 10:34:25.537245-04	20260813104500_remove_publication_links	\N	\N	2026-08-13 10:34:25.522729-04	1
a17714b9-affa-4866-bac9-a927dfd28967	e80e4066ef72066a184afc0d6e3414125b1b850c16de09210badd614be0b598b	2026-08-13 10:39:30.875214-04	20260813110000_change_awards_to_count	\N	\N	2026-08-13 10:39:30.842574-04	1
6fc227d8-f2c1-4e05-a6df-53ea8a8c1faf	d77772e182dd10ade646adb34f1c7f202d8a10fa4ba8e742cf0c1e4e43096ec3	2026-08-13 10:46:15.820791-04	20260813111500_add_waitlist_until_term	\N	\N	2026-08-13 10:46:15.798535-04	1
ed858b7a-0834-4670-8e4e-181e95eda9e5	de381619d0106f0e9d20e5d4e89c80f3c56e00ac6bf08e2556e518a0303536a8	2026-08-13 11:07:00.142313-04	20260813113000_remove_research_area	\N	\N	2026-08-13 11:07:00.13972-04	1
5f894902-13eb-4289-8be8-1da27fa3b511	9cfd72fc91131b83caadaecf8de0db6dcc3196f286279b4d55f95285651a8a06	\N	20260813114500_add_terms_and_named_awards	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20260813114500_add_terms_and_named_awards\n\nDatabase error code: 23514\n\nDatabase error:\nERROR: check constraint "applications_publications_limit" of relation "applications" is violated by some row\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E23514), message: "check constraint \\"applications_publications_limit\\" of relation \\"applications\\" is violated by some row", detail: None, hint: None, position: None, where_: None, schema: Some("public"), table: Some("applications"), column: None, datatype: None, constraint: Some("applications_publications_limit"), file: Some("tablecmds.c"), line: Some(6133), routine: Some("ATRewriteTable") }\n\n	2026-08-13 11:31:44.169258-04	2026-08-13 11:31:25.760177-04	0
35bfeac3-699b-432a-960d-0f81f77bdd8e	afbe1c8fed67340bf00af21da7f538c9482806276ff733c4005d55e7dbd91736	2026-08-13 11:32:21.603135-04	20260813114500_add_terms_and_named_awards		\N	2026-08-13 11:32:21.603135-04	0
\.


--
-- Data for Name: schools; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.schools (id, name, "createdAt", "updatedAt") FROM stdin;
86796a0b-062e-457b-a05e-436316310ce4	City Tech	2026-08-12 16:08:37.65-04	2026-08-12 16:08:37.65-04
\.


--
-- Data for Name: programs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.programs (id, "schoolId", name, "degreeLevel", "createdAt", "updatedAt") FROM stdin;
cf2b87d0-e81a-4d65-a58e-308b3dd53525	86796a0b-062e-457b-a05e-436316310ce4	Computer Science	Masters	2026-08-12 16:08:37.659-04	2026-08-12 16:08:37.659-04
\.


--
-- Data for Name: terms; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.terms (id, name, "academicYear", "startDate", "endDate", "createdAt", "updatedAt") FROM stdin;
1c914a03-205f-4dc0-b141-5794747a5da7	Fall	2026	\N	\N	2026-08-12 16:08:37.665-04	2026-08-12 16:08:37.665-04
478cbfbd-522a-4f9d-8412-54ce817eacfc	Spring	2026	\N	\N	2026-08-13 11:32:20.91-04	2026-08-13 11:32:20.91-04
99e1a882-76de-471b-96cd-46030a5c28d3	Spring	2027	\N	\N	2026-08-13 11:32:20.91-04	2026-08-13 11:32:20.91-04
b8043460-23a1-4d43-b408-1e9de48dbc2d	Fall	2027	\N	\N	2026-08-13 11:32:20.91-04	2026-08-13 11:32:20.91-04
ac36f1ed-c554-4c9b-b2f5-b1ac4f5c58b9	Spring	2028	\N	\N	2026-08-13 11:32:20.91-04	2026-08-13 11:32:20.91-04
263b3a88-1b68-4bcf-be8c-e428d48d4816	Fall	2028	\N	\N	2026-08-13 11:32:20.91-04	2026-08-13 11:32:20.91-04
ecceae26-d1c4-44e9-98b4-f348a8ad29f9	Spring	2029	\N	\N	2026-08-13 11:32:20.91-04	2026-08-13 11:32:20.91-04
e48107b0-a777-4c13-9ff2-161d1475a5bf	Fall	2029	\N	\N	2026-08-13 11:32:20.91-04	2026-08-13 11:32:20.91-04
6d91c15d-078c-4241-bd1f-1fd5b62094d5	Spring	2030	\N	\N	2026-08-13 11:32:20.91-04	2026-08-13 11:32:20.91-04
fc084218-ba81-4e13-bde4-ad858e2acde3	Fall	2030	\N	\N	2026-08-13 11:32:20.91-04	2026-08-13 11:32:20.91-04
50b0702c-7e60-4919-875d-4087532eb31a	Spring	2031	\N	\N	2026-08-13 11:32:20.91-04	2026-08-13 11:32:20.91-04
4b130ab7-dbfe-4b02-9dd3-014da0fba148	Fall	2031	\N	\N	2026-08-13 11:32:20.91-04	2026-08-13 11:32:20.91-04
\.


--
-- PostgreSQL database dump complete
--

\unrestrict ifN1qY6yJORLvAO6KmbuOQCpWJX5ROsBROXDeBNgqlKJ4zzcob0G2pqsQZANAKN
