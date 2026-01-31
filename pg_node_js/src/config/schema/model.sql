CREATE TABLE persons (
  id              BIGSERIAL PRIMARY KEY,
  tenant_id       TEXT NOT NULL,
  user_id         TEXT NULL,        
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE (tenant_id, user_id)
);

CREATE TABLE anonymous_ids (
  id              BIGSERIAL PRIMARY KEY,
  tenant_id       TEXT NOT NULL,
  anonymous_id    TEXT NOT NULL,
  person_id       BIGINT,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE (tenant_id, anonymous_id),
  CONSTRAINT fk_persons
      FOREIGN KEY (person_id)      
      REFERENCES persons(id)        
      ON DELETE SET NULL
      ON UPDATE CASCADE
);

CREATE TABLE users (
  tenant_id       TEXT NOT NULL,
  user_id         TEXT NOT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (tenant_id, user_id)
);

CREATE TABLE events (
  id              BIGSERIAL PRIMARY KEY,
  tenant_id       TEXT NOT NULL,
  person_id       BIGINT REFERENCES persons(id),
  event           TEXT NOT NULL,
  properties      JSONB,
  timestamp       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);