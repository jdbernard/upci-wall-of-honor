## Steps to create a new environment.

1. Clone a pre-existing environment's Terraform scripts.

   ```sh
   cd operations/terraform/environments
   cp -r dev sample
   ```

2. Rename and update the terraform file for the new environment.

   ```sh
   cd operations/terraform/environments/sample
   mv dev_env.tf sample_env.tf
   vim sample_env.tf
   ```

3. Create the Okta application .
4. Update the JWT Verifier configuration with the new Okta client details in
   `/api/lambda/verify_jwt/environments.config.json`
5. Redeploy the `project_setup` module.

   ```sh
   cd operations/terraform/project_setup
   terraform apply
   ```

6. Deploy the new environment module.

   ```sh
   cd operations/terraform/environments/sample
   terraform apply
   ```
