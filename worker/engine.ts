enum Status {
  Active = "ACTIVE",
  Completed = "COMPLETED",
}

interface Campaigns {
  camp_id: string;
  tenant_id: string;
  trigger: {
    type: "event";
    eventName: string;
  };
  status: Status.Active | Status.Completed;
  TIMESTAMP: string;
}

async function process() {
  const campaigns = [];
}
