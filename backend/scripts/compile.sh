#!/bin/bash

# Circom のコンパイル
circom circuits/example.circom --wasm --r1cs -o build

# Trusted Setup
snarkjs groth16 setup build/example.r1cs powersOfTau28_hez_final_12.ptau circuit_0000.zkey
snarkjs zkey contribute circuit_0000.zkey build/circuit_final.zkey

# 検証キーのエクスポート
snarkjs zkey export verificationkey build/circuit_final.zkey build/verification_key.json