/**
 * Seed script: creates test users via Supabase Auth sign-up API (no service role needed),
 * then inserts model_profiles with placeholder data.
 *
 * Usage:  node scripts/seed.mjs
 */

const SUPABASE_URL = "https://ijlifxehdznbmsatxsnm.supabase.co";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqbGlmeGVoZHpuYm1zYXR4c25tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMjcwMzAsImV4cCI6MjA5MTYwMzAzMH0.WaG7pQsawtgpPLtE6mEodxtgAXla9uVRb-SrMfvB4bM";

const TEST_USERS = [
  {
    email: "admin@catwalk.agency",
    password: "Admin1234!",
    profile: {
      nombre: "HQ Admin",
      role: "admin",
      altura: null,
      color_ojos: null,
      medidas: null,
      bio_profesional: null,
      foto_url: null,
    },
  },
  {
    email: "elara.vane@catwalk.agency",
    password: "Model1234!",
    profile: {
      nombre: "Elara Vane",
      role: "model",
      altura: 180,
      color_ojos: "Esmeralda",
      medidas: "82-60-88",
      bio_profesional:
        "Proveniente de la costa de Provenza, Elara Vane aporta una presencia etérea al circuito de alta moda. Su versatilidad abarca desde la pasarela avant-garde hasta la narrativa editorial cinematográfica.",
      foto_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCdtyUcZ2AEVci9IPSppHBa16vrY8-wEcqdHAmBlWpmIJTvfleX9UPsmFFvlgBKZ2xYvE2cHSYB7fAhz4NYVwTzZjDr8ZvBWDxqWfz9RN1PQP9HKAodG3k92Ufw74L4r2pmpsh2Q181Kygz5Tud02CIuG62set0NBLYvEHrPCMep178KFREqC0YqEqcUDVynTCUDzWzxUI7PqQWNOe2Hoq821u_M_X87bKHPZ-04QALAVW4kDDHFGN1RTkS8x5b65z7tTyQJ4uI0g",
    },
  },
  {
    email: "caspian.kroh@catwalk.agency",
    password: "Model1234!",
    profile: {
      nombre: "Caspian Kroh",
      role: "model",
      altura: 188,
      color_ojos: "Gris",
      medidas: "100-80-95",
      bio_profesional:
        "Caspian Kroh representa la nueva ola del modelaje masculino. Con raíces berlinesas y presencia en las pasarelas de Nueva York, combina una estética brutalista con una elegancia magnética.",
      foto_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBWmiTUMmIRcbElm_glmI4-Z-kmhfix817JLn5aNiP3RRXw4ij6t3_4CXUq7dkc5-2Z1YjmDGMcMNfepyAt4L7x8S0DFQZU3cJHX8mhH4t3Aty1TavUH0sCWkq4hEiA2kIV3EdzlAm2cmoxvbg5RjyPnf2PUSMfmM6kjCVLwL7EKU1dAx2_ak_8bOvtL23dFJ54hmDSoKR3Ij1mCPnfIsyxV-GGNNQjAc2lOKz7brWsfeuSzOEdnXZMFwUEcQ6W2yGYBiXgFlrNBw",
    },
  },
  {
    email: "juno.sato@catwalk.agency",
    password: "Model1234!",
    profile: {
      nombre: "Juno Sato",
      role: "model",
      altura: 175,
      color_ojos: "Marrón oscuro",
      medidas: "80-58-86",
      bio_profesional:
        "Desde Tokio hasta Milán, Juno Sato fusiona la estética minimalista japonesa con la audacia de la alta costura europea. Su mirada penetrante y versatilidad la convierten en la elección predilecta de editoriales vanguardistas.",
      foto_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBpnzgjZoHdONkZCQSIcVHreq9DnAKgQ8iQQr6ZmXSZtCvXvlp_P1N81Ix1Y17nf6jVLxdiKyAAkZURNa0sZOuEpDUz9jsSnUqv6Ceap46zMSFgOeivfx2SMgNZ5RDk2DaSWM_IpVxGR87Yg1kSA3PLCLP5MhiVNx9KL8hj3MbNSzuAKlXAdFP0plNK08699f8eF8syI_60t17OBIfQOVXb5Z62AvK_UHIZ1nUSdpXcBPYlJqbd4x0Iv02tUv_BdVdqKtobzHhPmQ",
    },
  },
  {
    email: "alessia.moretti@catwalk.agency",
    password: "Model1234!",
    profile: {
      nombre: "Alessia Moretti",
      role: "model",
      altura: 177,
      color_ojos: "Avellana",
      medidas: "84-62-90",
      bio_profesional:
        "Alessia Moretti encarna la sofisticación italiana con una frescura contemporánea. Su presencia en pasarelas de Milán y París ha consolidado su estatus como una de las figuras más prometedoras de la nueva generación.",
      foto_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBxfwHbnmCcyP9ktbEyz6GVLWi_w7epTrQY7pBy9A57bc4kMxnYZqjpEWMAz8QVftg0aQni8VypzeoPjdmOlr51Bhb7oSlJocp85Mt42nWhuOPgnS-br_6HLloBg65gIAGTExNYKiSHL6R65mO-CV5M4j8w4kGvAoM69nXZxP_HDScbhOP_yvwA4UylGPVx74S7UTw-daRE3LsZmSfptOV2aHWxp5bIiwlkaUkyVm_Xd5QuYu_n-L1FHvkkaSgXEPy6qlDBRCc01A",
    },
  },
];

async function supaFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      apikey: ANON_KEY,
      ...options.headers,
    },
  });
  return { status: res.status, data: await res.json() };
}

async function seed() {
  console.log("🌱 Seeding Catwalk database...\n");

  for (const u of TEST_USERS) {
    // Sign up user
    const { status, data } = await supaFetch("/auth/v1/signup", {
      method: "POST",
      body: JSON.stringify({ email: u.email, password: u.password }),
    });

    let userId = data?.id ?? data?.user?.id;

    if (status === 400 || status === 422) {
      console.log(`⏭️  ${u.email} — may already exist. Trying login...`);
      const loginRes = await supaFetch(
        "/auth/v1/token?grant_type=password",
        {
          method: "POST",
          body: JSON.stringify({ email: u.email, password: u.password }),
        },
      );
      if (loginRes.data?.user?.id) {
        userId = loginRes.data.user.id;
        console.log(`   ✅ Logged in as ${u.email} → ${userId}`);
      } else {
        console.error(`   ❌ Could not sign up or log in ${u.email}:`, loginRes.data);
        continue;
      }
    } else if (!userId) {
      console.log(`⚠️  ${u.email} signed up (may need email confirmation): `, data?.email ?? "check dashboard");
      continue;
    } else {
      console.log(`✅ Created ${u.email} → ${userId}`);
    }

    // Insert profile using the user's own session token
    if (u.profile && userId) {
      const loginRes = await supaFetch(
        "/auth/v1/token?grant_type=password",
        {
          method: "POST",
          body: JSON.stringify({ email: u.email, password: u.password }),
        },
      );
      const accessToken = loginRes.data?.access_token;

      if (accessToken) {
        const profileRes = await supaFetch("/rest/v1/model_profiles", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Prefer: "resolution=merge-duplicates",
          },
          body: JSON.stringify({ user_id: userId, ...u.profile }),
        });

        if (profileRes.status >= 200 && profileRes.status < 300) {
          console.log(`   ✅ Profile seeded for ${u.profile.nombre}`);
        } else {
          console.log(`   ⚠️  Profile insert (${profileRes.status}):`, JSON.stringify(profileRes.data));
        }
      }
    }
  }

  console.log("\n🎉 Seed complete!\n");
  console.log("Test credentials:");
  console.log("─────────────────────────────────────────────────");
  console.log("ADMIN:  admin@catwalk.agency / Admin1234!");
  console.log("MODEL:  elara.vane@catwalk.agency / Model1234!");
  console.log("MODEL:  caspian.kroh@catwalk.agency / Model1234!");
  console.log("MODEL:  juno.sato@catwalk.agency / Model1234!");
  console.log("MODEL:  alessia.moretti@catwalk.agency / Model1234!");
  console.log("─────────────────────────────────────────────────");
}

seed().catch(console.error);
