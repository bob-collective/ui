# Subgraph Deployment Guide

This README provides instructions on how to deploy subgraphs contained in this folder using Goldsky.

## Steps to Deploy

To deploy the subgraphs, you'll need to use the Goldsky command-line tools. Follow these steps:

1. **Login to Goldsky:**

   ```sh
   goldsky login
   ```

2. **Deploy the Subgraph:**
   Make sure you are in the directory containing the subgraph you want to deploy. Run:
   ```sh
   goldsky subgraph deploy poap-subgraph/1.0.0 --path .
   ```

## Further Documentation

For more detailed information about using Goldsky, please refer to the [Goldsky Documentation](https://docs.goldsky.com/introduction).
