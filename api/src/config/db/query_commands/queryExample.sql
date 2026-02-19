-- -------- GET A USERS ALL EVENTS ------------ 

SELECT p.user_id, e.event FROM persons p JOIN ON event e p.id=e.person_id AND p.tenant_id=e.tenant_id ;