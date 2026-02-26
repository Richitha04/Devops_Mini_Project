CREATE TABLE criminals(

id BIGSERIAL PRIMARY KEY,

name TEXT,

alias TEXT,

crime_description TEXT,

threat_level TEXT,

case_status TEXT,

captured BOOLEAN,

terminated BOOLEAN

);

CREATE TABLE sightings(

id BIGSERIAL PRIMARY KEY,

criminal_id BIGINT REFERENCES criminals(id),

location TEXT,

date TIMESTAMP,

note TEXT

);

CREATE TABLE crime_logs(

id BIGSERIAL PRIMARY KEY,

timestamp TIMESTAMP,

action TEXT,

details TEXT

);